import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/api/v1/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const getInterviewReportById = async (reportId) => {
  const response = await api.get(
    `/api/v1/interview/report/${reportId}`,
  );

  return response.data;
};

const getAllInterviewReports = async () => {
  const response = await api.get("api/v1/interview/report");

  return response.data;
};

export {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
};
