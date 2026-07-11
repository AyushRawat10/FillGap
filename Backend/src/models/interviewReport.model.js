import mongoose, { Schema } from "mongoose";

const technicalQuestion = new Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const behaviourQuestion = new Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const skillGap = new Schema({
    lucideIcon: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["danger", "medium", "high priority"],
        required: true
    }
}, {
    _id: false
})

const roadmap = new Schema({
    day: {
        type: Number,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    advice: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const interviewReportSchema = new Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required."]
    }, 
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        required: true
    },
    technicalQuestion: [technicalQuestion],
    behaviourQuestion: [behaviourQuestion],
    skillGap: [skillGap],
    roadmap: [roadmap]
})

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema)