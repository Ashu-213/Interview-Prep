// Optional fetch fallback for Groq HTTP calls (Node 18+ has global fetch)
let fetchFn = globalThis.fetch;
if (!fetchFn) {
    try {
        // eslint-disable-next-line global-require
        fetchFn = require("node-fetch");
    } catch (e) {
        fetchFn = null;
    }
}

// No OpenRouter/OpenAI client — this service uses Groq HTTP API only.

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

    // Decide provider and model from environment
    const provider = (process.env.LLM_PROVIDER || "groq").toLowerCase();
    const model = process.env.MODEL || "llama-3.3-70b-versatile";
    const maxTokens = parseInt(process.env.MAX_TOKENS || "4000", 10);
    const temperature = parseFloat(process.env.TEMPERATURE || "0.3");

    // Helper for calling Groq-style HTTP APIs when requested
    async function callGroqAPI(messages) {
        if (!fetchFn) {
            throw new Error("No fetch available in runtime. Install 'node-fetch' or use Node 18+.");
        }

        const groqUrl = process.env.GROQ_API_URL || "https://api.groq.ai/v1/complete";
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            throw new Error("GROQ_API_KEY is not set in environment");
        }

        const body = {
            model,
            // Many LLM HTTP APIs accept 'messages' or 'input' — pass messages to keep structure.
            messages,
            max_tokens: maxTokens,
            temperature
        };

        const res = await fetchFn(groqUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        // Try common response shapes
        // 1) { output: 'text' }  2) { choices: [{ text: '...' }]} 3) { choices: [{ message: { content: '...' } }] }
        const text = data.output || (data.choices && (data.choices[0].text || data.choices[0].message?.content));

        if (!text) {
            console.error("Unexpected Groq response shape:", JSON.stringify(data).substring(0, 1000));
            throw new Error("GROQ API returned an unexpected response");
        }

        return text;
    }

    try {
        // Prepare messages in Chat format for both providers
        const messages = [
            { role: "system", content: "Return ONLY valid JSON. No markdown. No explanation." },
            { role: "user", content: prompt }
        ];

        let raw;

        raw = await callGroqAPI(messages);

        console.log("✅ AI raw response:", raw.substring(0, 200));

        const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

        return safeJSONParse(cleaned);

    } catch (err) {
        console.error("❌ LLM provider error:");
        console.error("Message:", err.message || err);

        // Provide more helpful error messages for common failure modes
        if ((err.status === 401) || (err.message && err.message.includes("401"))) {
            throw new Error("API Authentication failed - check your provider API key and environment variables");
        }
        if ((err.status === 403) || (err.message && err.message.includes("403"))) {
            throw new Error("API access denied - check referer, key permissions, and provider configuration");
        }

        throw err;
    }
}

module.exports = {
    generateInterviewReport
};