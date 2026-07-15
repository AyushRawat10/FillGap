import { useContext } from "react";
import { InterviewContext } from "../contexts/InterviewContext.jsx";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.service.js";

export const useInterview = () => {
  const context = useContext(InterviewContext);

    if(!context) {
        throw new Error("useInterview must be used within an InterviewProvider !")
    }

  const { loading, setLoading, report, setReport, allReports, setAllReports } =
    context;

  const handleToGenerateInterviewReport = async ({selfDescription, jobDescription, resumeFile}) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      console.log(response.data)
      setReport(response.data)
    } catch (error) {
      console.log("handleToGenerateInterviewReport : ",error)
      throw error
    } finally {
      setLoading(false)
    }

    return response.data
  };

  const handleToGetReportById = async (reportId) => {
    setLoading(true)
    let response = null;
    try {
        response = await getInterviewReportById(reportId)
        setReport(response.data)
    } catch (error) {
        console.log("handleToGetReportById : ", error)
    } finally {
        setLoading(false)
    }

    return response.data
  }

  const hadleToGetAllReports = async () => {
    setLoading(true)
    let response = null;
    try {
        response = await getAllInterviewReports()
        setAllReports(response.data)
    } catch (error) {
        console.log("handleToGetAllReports : ", error)
    } finally {
        setLoading(false)
    }

    return response.data
  }

  return {loading, report, allReports, handleToGenerateInterviewReport, handleToGetReportById, hadleToGetAllReports}
};
