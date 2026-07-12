import { PDFParse } from "pdf-parse";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model.js";

const generateReport = asyncHandler(async (req, res) => {
    
    const { jobDescription, selfDescription } = req.body;

    if(!jobDescription) {
        throw new ApiError(400, "Job description is required !")
    }

    if(!req.file && !selfDescription) {
        throw new ApiError(400, "Provide at least a resume or a self description !")
    }

    let resume = null;
    if(req.file) {
        const resumeContent = new PDFParse(Uint8Array.from(req.file.buffer));
        const parsed = await resumeContent.getText();
        await resumeContent.destroy()
        resume = parsed.text
    }

    const report = await generateInterviewReport({
        resume,
        jobDescription,
        selfDescription: selfDescription || null,
    });

    const reportData = await InterviewReport.create({
        user: req.user._id,
        jobDescription,
        resume,
        selfDescription: selfDescription || undefined,
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

const getReportById = asyncHandler(async (req, res) => {
    const { interviewReportId } = req.params

    const interviewReport = await InterviewReport.findById(interviewReportId)

    if(!interviewReport) {
        throw new ApiError(404, "Interview report not found !")
    }

    if(interviewReport.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view this report !")
    }

    res.status(200).json(new ApiResponse(200, interviewReport, "Interview report fetched successfully."))
})

const getAllReports = asyncHandler(async (req, res) => {
    
    const allInterviewReports = await InterviewReport.find({user: req.user._id}).sort({createdAt: -1}).select(
        "-jobDescription -resume -selfDescription -technicalQuestions -behavioralQuestions -skillGaps -roadmap"
    )

    res.status(200).json(new ApiResponse(200, allInterviewReports, "All interview repots fetched succesfully."))

})

export { generateReport, getReportById, getAllReports };
