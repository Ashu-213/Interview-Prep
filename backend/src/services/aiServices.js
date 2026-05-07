const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Plain JSON schema — avoids zod v3/v4 compatibility issues with zodToJsonSchema
const interviewReportSchema = {
    type: "object",
    properties: {
        overallScore: {
            type: "number",
            description: "Score 0-100 showing how well the candidate matches the job"
        },
        title: {
            type: "string",
            description: "Exact job title extracted from the job description"
        },
        technicalQuestions: {
            type: "array",
            description: "5-7 technical questions tailored to the role",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical interview question" },
                    intentions: { type: "string", description: "Why the interviewer asks this and what they look for" },
                    answer: { type: "string", description: "Detailed guide on how to answer effectively" }
                },
                required: ["question", "intentions", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "5-7 behavioral questions tailored to the role",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral interview question" },
                    intentions: { type: "string", description: "Why the interviewer asks this and what they look for" },
                    answer: { type: "string", description: "Detailed guide using STAR method" }
                },
                required: ["question", "intentions", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Key gaps between candidate profile and job requirements",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The skill or knowledge area that is lacking" },
                    gap: { type: "string", description: "What the gap is and why it matters for this role" },
                    severity: { type: "string", enum: ["low", "medium", "high"], description: "Criticality: high=deal-breaker, medium=important, low=nice-to-have" }
                },
                required: ["skill", "gap", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "7-day structured preparation plan",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day number (1-7)" },
                    focus: { type: "string", description: "Main focus area for the day" },
                    tasks: { type: "array", items: { type: "string" }, description: "Specific actionable tasks for the day" }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["overallScore", "title", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ sampleResume, jobDescription, selfDescription }) {
    const prompt =
        `You are an expert AI interview coach. Analyze the candidate information below and generate a comprehensive, highly personalized interview preparation report. Return ONLY valid JSON matching the schema exactly.

RESUME:
${sampleResume}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

Instructions:
- overallScore: honest 0-100 match score
- title: copy the exact job title from the job description above
- technicalQuestions: 5-7 questions specific to the role and candidate background
- behavioralQuestions: 5-7 questions relevant to this role
- skillGaps: identify real gaps between the candidate and this role
- preparationPlan: exactly 7 days, each with a focus and 3-5 specific tasks`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    });

    const raw = response.text;
    console.log("✅ AI raw response (first 200 chars):", raw.substring(0, 200));
    return JSON.parse(raw);
}

module.exports = { generateInterviewReport };
