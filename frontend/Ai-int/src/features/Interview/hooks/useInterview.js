import {getAllInterviewReports, generateInterviewReport, getInterviewReportById} from "../services/interviewApi";
import { useContext } from "react";
import { InterviewContext } from "../interviewContext";




export const useInterview = () => {
    const context = useContext(InterviewContext);

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    const {loading, setloading, report, setReport, reports, setReports} = useContext(InterviewContext);


    const generateReport = async ({resumeFile, jobDescription, selfDescription}) => {
        try {
            setloading(true);
            const response = await generateInterviewReport({resumeFile, jobDescription, selfDescription});
            setReport(response.interviewReport);
        } catch (error) {
            console.error("Error generating interview report:", error);
        }
        finally{
            setloading(false);
        }
    }


    const fetchReportById = async (interviewId) => {
        try {
            setloading(true);
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        }
        catch (error) {
            console.error("Error fetching interview report by ID:", error);
        }
        finally{
            setloading(false);
        }
    }

    
    const fetchAllReports = async () => {
        try {
            setloading(true);
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        }
        catch (error) {
            console.error("Error fetching all interview reports:", error);
        }
        finally{
            setloading(false);
        }
    }

    return {loading, report, reports, generateReport, fetchReportById, fetchAllReports}
}
