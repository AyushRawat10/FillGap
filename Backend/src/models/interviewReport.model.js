import mongoose, { Schema } from "mongoose";

const matchScore = new Schema(
    {
        accuracy: {
            type: Number,
            required: true,
        },
        matchScoreTitle: {
            type: String,
            required: true,
        },
        matchScoreDescription: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const technicalQuestion = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        intention: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const behaviourQuestion = new Schema(
    {
        question: {
            type: String,
            required: true,
        },
        intention: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const skillGap = new Schema(
    {
        lucideIcon: {
            type: String,
            required: true,
        },
        skill: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            required: true,
        },
    },
    {
        _id: false,
    }
);

const roadmap = new Schema(
    {
        day: {
            type: Number,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        advice: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const interviewReportSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required."],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    matchScore: matchScore,
    technicalQuestions: [technicalQuestion],
    behavioralQuestions: [behaviourQuestion],
    skillGaps: [skillGap],
    roadmap: [roadmap],
}, {
    timestamps: true
});

export const InterviewReport = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);
