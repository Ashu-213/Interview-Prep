const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
    overallScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job description. Higher is better."),
    title: z.string().describe("The job title for which this interview report is generated"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("A technical question likely to be asked in the interview"),
        intentions: z.string().describe("Why the interviewer asks this question and what they are looking for"),
        answer: z.string().describe("A detailed guide on how to answer this question effectively, what key points to cover, and common mistakes to avoid")
    })).describe("5-7 technical questions tailored to the job description and candidate's background"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("A behavioral question likely to be asked in the interview"),
        intentions: z.string().describe("Why the interviewer asks this question and what they are looking for"),
        answer: z.string().describe("A detailed guide on how to answer using the STAR method, what key points to cover, and common mistakes to avoid")
    })).describe("5-7 behavioral questions tailored to the job description and candidate's background"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill or knowledge area the candidate is lacking or needs to improve"),
        gap: z.string().describe("A clear description of what the gap is and why it matters for this role"),
        severity: z.enum(["low", "medium", "high"]).describe("How critical this gap is: high = deal-breaker, medium = important, low = nice to have")
    })).describe("Key skill gaps between the candidate profile and job requirements"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number in the preparation timeline"),
        focus: z.string().describe("The main focus area for this day"),
        tasks: z.array(z.string()).describe("Specific actionable tasks to complete on this day")
    })).describe("A 7-day structured preparation plan to get the candidate ready for the interview"),
});

async function generateInterviewReport({ sampleResume, jobDescription, selfDescription }) {
    const prompt =
        `You are an expert AI interview coach. Analyze the following candidate information carefully and generate a comprehensive, highly personalized interview preparation report.

RESUME:
${sampleResume}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE SELF-DESCRIPTION:
${selfDescription}

Generate a detailed, actionable report with:
- An honest overall match score (0-100)
- 5-7 technical interview questions specific to the role and candidate's background
- 5-7 behavioral questions relevant to the role
- Key skill gaps with clear descriptions and severity levels
- A practical 7-day preparation plan with specific daily tasks
- The exact job title from the job description`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    });

    return JSON.parse(response.text);
}

module.exports = { generateInterviewReport };
