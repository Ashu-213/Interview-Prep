const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");



const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 that indicates how well the candidate's resume and self-description match the job description, with a higher score indicating a better match."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intentions: z.string().describe("The intentions behind asking the technical question"),
        answer: z.string().describe("How to answer this question effectively, what points to cover, and what common mistakes to avoid")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intentions: z.string().describe("The intentions behind asking the behavioral question"),
        answer: z.string().describe("How to answer this question effectively, what points to cover, and what common mistakes to avoid")
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill that the candidate is lacking or needs improvement in"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity level of the skill gap"),
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The specific day in the preparation plan"),
        focus: z.string().describe("The main focus or theme for that day of preparation"),
        tasks: z.array(z.string()).describe("A list of specific tasks or activities for that day")
    })),
    title: z.string().describe("The title of the job for which interview report is generated"),
});

async function generateInterviewReport({ sampleResume, jobDescription, selfDescription }) {

    const prompt = 
                `You are an AI interview assistant. Analyze the following information and generate a comprehensive interview report:

                Resume: ${sampleResume}
                Job Description: ${jobDescription}
                Self-Description: ${selfDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    });
    return JSON.parse(response.text);
}
module.exports = {
    generateInterviewReport
}
