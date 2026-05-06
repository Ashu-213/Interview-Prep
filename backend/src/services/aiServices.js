const { GoogleGenAI } = require("@google/genai");
const { z, JSON } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");
const { jobdescription } = require("./temp");
const { model } = require("mongoose");
const { response } = require("../app");



const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 that indicates how well the candidate's resume and self-description match the job description, with a higher score indicating a better match."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intentions: z.string().describe("The intentions behind asking the technical question"),
        answer: z.string().describe("How to answer this question effectively, what points to cover, and what common mistakes to avoid")
            .describe("The answer should be detailed and provide insights into what the interviewer is looking for in a good response.")
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intentions: z.string().describe("The intentions behind asking the behavioral question"),
        answer: z.string().describe("How to answer this question effectively, what points to cover, and what common mistakes to avoid")
            .describe("The answer should be detailed and provide insights into what the interviewer is looking for in a good response.")
    })),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill that the candidate is lacking or needs improvement in"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity level of the skill gap, indicating how critical it is for the candidate to address this gap in order to perform well in the interview and succeed in the role they are applying for"),
    })),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The specific day in the preparation plan, indicating the sequence of the preparation process"),
        focus: z.string().describe("The main focus or theme for that day of preparation, such as technical skills, behavioral questions, or mock interviews"),
        tasks: z.array(z.string()).describe("A list of specific tasks or activities that the candidate should complete on that day to effectively prepare for the interview, such as practicing coding problems, reviewing common behavioral questions, or conducting mock interviews with peers.")
    })),
    title: z.string().describe("The title of the job for which interview report is generated"),

});

async function generateInterviewReport({ sampleResume, jobdescription, selfdescription }) {

    const prompt = 
                `You are an AI interview assistant. Analyze the following information and generate a comprehensive interview report:

                Resume: ${sampleResume}
                Job Description: ${jobdescription}
                Self-Description: ${selfdescription}`

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
