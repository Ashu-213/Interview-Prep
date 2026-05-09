import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});


/** 
 * @desc service to generate interview report based on user self description, job description and resume file 
 */
export const generateInterviewReport = async ({resumeFile, jobDescription, selfDescription}) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}


/**
 * @desc service to get interview report by interview ID
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}


/**
 *@desc service to get interview report of loggedin user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/");
    return response.data;
}
