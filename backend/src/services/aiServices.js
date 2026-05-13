const OpenAI = require("openai");

// Get referer from env or construct from headers
const getReferer = () => {
    if (process.env.API_REFERER) {
        return process.env.API_REFERER;
    }
    // Fallback for development only
    return process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://ai-interview.app";
};

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",

    apiKey: process.env.OPENROUTER_API_KEY,

    defaultHeaders: {
        "HTTP-Referer": getReferer(),
        "X-Title": "InterviewPrepAI"
    },
    
    // Add timeout configuration for production stability
    timeout: process.env.NODE_ENV === 'production' ? 60000 : 30000, // 60s for prod, 30s for dev
    maxRetries: process.env.NODE_ENV === 'production' ? 2 : 0
});

// Plain JSON schema
const interviewReportSchema = {
    type: "object",

    properties: {

        overallScore: {
            type: "number",
            description:
                "Score 0-100 showing how well the candidate matches the job"
        },

        title: {
            type: "string",
            description:
                "Exact job title extracted from the job description"
        },

        technicalQuestions: {
            type: "array",

            description:
                "5-7 technical questions tailored to the role",

            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "The technical interview question"
                    },

                    intentions: {
                        type: "string",
                        description:
                            "Why the interviewer asks this and what they look for"
                    },

                    answer: {
                        type: "string",
                        description:
                            "Detailed guide on how to answer effectively"
                    }
                },

                required: [
                    "question",
                    "intentions",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",

            description:
                "5-7 behavioral questions tailored to the role",

            items: {
                type: "object",

                properties: {

                    question: {
                        type: "string",
                        description:
                            "The behavioral interview question"
                    },

                    intentions: {
                        type: "string",
                        description:
                            "Why the interviewer asks this and what they look for"
                    },

                    answer: {
                        type: "string",
                        description:
                            "Detailed guide using STAR method"
                    }
                },

                required: [
                    "question",
                    "intentions",
                    "answer"
                ]
            }
        },

        skillGaps: {
            type: "array",

            description:
                "Key gaps between candidate profile and job requirements",

            items: {
                type: "object",

                properties: {

                    skill: {
                        type: "string",
                        description:
                            "The skill or knowledge area that is lacking"
                    },

                    gap: {
                        type: "string",
                        description:
                            "What the gap is and why it matters for this role"
                    },

                    severity: {
                        type: "string",

                        enum: [
                            "low",
                            "medium",
                            "high"
                        ],

                        description:
                            "Criticality level"
                    }
                },

                required: [
                    "skill",
                    "gap",
                    "severity"
                ]
            }
        },

        preparationPlan: {
            type: "array",

            description:
                "7-day structured preparation plan",

            items: {
                type: "object",

                properties: {

                    day: {
                        type: "number",
                        description:
                            "Day number (1-7)"
                    },

                    focus: {
                        type: "string",
                        description:
                            "Main focus area for the day"
                    },

                    tasks: {
                        type: "array",

                        items: {
                            type: "string"
                        },

                        description:
                            "Specific actionable tasks"
                    }
                },

                required: [
                    "day",
                    "focus",
                    "tasks"
                ]
            }
        }
    },

    required: [
        "overallScore",
        "title",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

function safeJSONParse(text) {

    try {
        return JSON.parse(text);

    } catch (err) {

        console.error("❌ Invalid JSON:");
        console.error(text);

        throw new Error("AI returned invalid JSON");
    }
}

async function generateInterviewReport({
    sampleResume,
    jobDescription,
    selfDescription
}) {

    const prompt = `
You are an expert AI interview coach.

Analyze the candidate information below and generate a comprehensive, highly personalized interview preparation report.

Return ONLY valid JSON matching the schema exactly.

Schema:
${JSON.stringify(interviewReportSchema)}

RESUME:
${sampleResume}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

Instructions:
- overallScore: honest 0-100 match score
- title: exact job title
- technicalQuestions: 5-7 role-specific questions
- behavioralQuestions: 5-7 behavioral questions
- skillGaps: identify real gaps
- preparationPlan: exactly 7 days
`;

    try {

        const response =
            await client.chat.completions.create({

                model:
                    "openai/gpt-4-turbo",

                messages: [

                    {
                        role: "system",

                        content:
                            "Return ONLY valid JSON. No markdown. No explanation."
                    },

                    {
                        role: "user",
                        content: prompt
                    }
                ],

                response_format: {
                    type: "json_object"
                },

                temperature: 0.3,

                max_tokens: 4000
            });

        const raw =
            response.choices[0].message.content;

        console.log(
            "✅ AI raw response:",
            raw.substring(0, 200)
        );

        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return safeJSONParse(cleaned);

    } catch (err) {

        console.error("❌ OpenRouter API Error:");
        console.error("Message:", err.message);
        console.error("Status:", err.status);
        console.error("Response:", err.response?.data || "No response data");
        console.error("API Key Set:", !!process.env.OPENROUTER_API_KEY);
        console.error("API Referer:", getReferer());

        // Provide more helpful error messages
        if (err.status === 401 || err.message.includes("401")) {
            throw new Error("API Authentication failed - check OPENROUTER_API_KEY");
        }
        if (err.status === 403 || err.message.includes("403")) {
            throw new Error("API access denied - check HTTP-Referer and API key permissions");
        }

        throw err;
    }
}

module.exports = {
    generateInterviewReport
};