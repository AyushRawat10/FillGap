import { PDFParse } from "pdf-parse";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model.js";

const generateReport = asyncHandler(async (req, res) => {
    
    const resumeContent = new PDFParse(Uint8Array.from(req.file.buffer));
    const resume = await resumeContent.getText();
    const { jobDescription, selfDescription } = req.body;

    const report = await generateInterviewReport({
        resume: resume.text,
        jobDescription,
        selfDescription,
    });

    const reportData = await InterviewReport.create({
        user: req.user._id,
        jobDescription,
        resume: resume.text,
        selfDescription,
        ...report,
    });

    res.status(201).json(
        new ApiResponse(
            201,
            reportData,
            "Generate interview report succesfully"
        )
    );
});

export { generateReport };
