const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/aiServices");
const interviewReportModel = require("../models/interviewReport");
const { sampleResume } = require("../services/temp");



/**
 * @desc controller to generate interview report based on resume, job description and self description
 */
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


/**
 * @desc controller to get interview report by interview ID
 */
async function getInterviewReportByIdController(req, res){
    const {interviewId} = req.params;

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user._id});

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        })
    }
    res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport
    })
}

/**
 * @desc controller to get all interview reports of a loggedin user
 */
async function getAllInterviewReportsController(req, res){
    const interviewReports = await interviewReportModel.find({user: req.user._id}).sort({createdAt: -1}).select("-resume -jobDescription -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preprationPlan");
    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
}


module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController }