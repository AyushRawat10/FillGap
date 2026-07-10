import mongoose, { Schema } from "mongoose";

const interviewReportSchema = new Schema({
    reportTitle: {
        type: String,
        required: true,
        index: true,
    },
    techinalQuestions: {
        type: Array
    }
})

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema)