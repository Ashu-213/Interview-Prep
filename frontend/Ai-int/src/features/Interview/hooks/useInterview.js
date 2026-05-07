import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interviewApi";
import { useContext } from "react";
import { InterviewContext } from "../interviewContext";


export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setloading, report, setReport, reports, setReports } = context;


    const generateReport = async ({ resumeFile, jobDescription, selfDescription }) => {
        try {
            setloading(true);
            const response = await generateInterviewReport({ resumeFile, jobDescription, selfDescription });
            setReport(response.interviewReport);
            return response;
        } catch (error) {
            console.error("Error generating interview report:", error);
            return null;
        } finally {
            setloading(false);
        }
    };


    const fetchReportById = async (interviewId) => {
        try {
            setloading(true);
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (error) {
            console.error("Error fetching interview report by ID:", error);
            return null;
        } finally {
            setloading(false);
        }
    };


    const fetchAllReports = async () => {
        try {
            setloading(true);
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
            return response.interviewReports;
        } catch (error) {
            console.error("Error fetching all interview reports:", error);
            return null;
        } finally {
            setloading(false);
        }
    };

    return { loading, report, reports, generateReport, fetchReportById, fetchAllReports };
};
