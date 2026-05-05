const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/aiServices");
const interviewReportModel = require("../models/interviewReport");
const { sampleResume } = require("../services/temp");


async function generateInterviewReportController(req, res){

    const resumeContent = await new pdfParse.PDFParse(Uint8Array(req.file.buffer)).getText();
    const jobDescription = req.body.jobDescription
    const selfDescription = req.body.selfDescription

    const interviewReportByAi = await generateInterviewReport({
        sampleResume: await resumeContent.text,
        jobDescription,
        selfDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        sampleResume: await resumeContent.text,
        jobDescription,
        selfDescription,
        ...interviewReportByAi 
    });

res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport
})
}



module.exports = { generateInterviewReportController }