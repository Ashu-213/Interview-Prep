const mongoose = require('mongoose');

/**
 * Job description schema : string
 * Resume schema : string
 * self description schema  : string
 * overall score    : number
 * 
 * technical questions : 
 * [{
 * question : "",
 * intentions : "",
 * answer : ""
 * }]
 * 
 * behavioral questions : 
 * [{
 * question : "",
 * intentions : "",
 * answer : ""
 * }]
 * skill gaps : [
 * {
 * skill : "",
 * gap : ""
 * severity :{
 * type: string,
 * enum: ["low", "medium", "high"]}
 *
 * }]
 *  prepration plan : [
 * {
 * day : number,
 * focus : string,
 * tasks : [string]
 * 
 * }]
 */


// Define the schema for interview report
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intentions: {
        type: String,
        required: [true, "Intentions are required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
},
    { _id: false }
);


// Define the schema for behavioral question
const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intentions: {
        type: String,
        required: [true, "Intentions are required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
},
    { _id: false }
);


// Define the schema for skill gap
const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    gap: {
        type: String,
        required: [true, "Gap is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
},
    { _id: false }
);


// Define the schema for preparation plan
const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: {
        type: [String],
        required: [true, "Tasks are required"]
    }
});



// Define the schema for preparation plan
const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    selfDescription: {
        type: String,
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title:{
        type: String,
        default: "Interview Report"
    }
},
    { timestamps: true }
);


const InterviewReport = mongoose.model('InterviewReport', interviewReportSchema);
module.exports = InterviewReport;


