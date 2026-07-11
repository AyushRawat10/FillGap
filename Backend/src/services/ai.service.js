import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

let ai;
const getClient = () => {
    if (!ai) {
        ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }
    
    return ai;
};

const interviewJsonSchema = {
    type: "object",
    properties: {
        matchScore: {
            type: "object",
            properties: {
                accuracy: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    description:
                        "Giving a score from 0 to 100, how well the candidate's resume and self-description match the job description.",
                },
                matchScoreTitle: {
                    type: "string",
                    description:
                        "A title that summarizes the match score, such as 'Excellent Match', 'Good Match', 'Average Match', or 'Poor Match'.",
                },
                matchScoreDescription: {
                    type: "string",
                    description:
                        "A brief description that explains the match score in more detail, highlighting the strengths and weaknesses of the candidate's resume and self-description in relation to the job description.",
                },
            },
            required: ["accuracy", "matchScoreTitle", "matchScoreDescription"],
        },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description:
                            "The technical question asked during the interview.",
                    },
                    intention: {
                        type: "string",
                        description:
                            "The intention behind the technical question, explaining what the interviewer is trying to assess or evaluate.",
                    },
                    answer: {
                        type: "string",
                        description:
                            "The candidate's answer to the technical question, providing their response and explanation.",
                    },
                },
                required: ["question", "intention", "answer"],
            },
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string",
                        description:
                            "The behavioral question asked during the interview.",
                    },
                    intention: {
                        type: "string",
                        description:
                            "The intention behind the behavioral question, explaining what the interviewer is trying to assess or evaluate.",
                    },
                    answer: {
                        type: "string",
                        description:
                            "The candidate's answer to the behavioral question, providing their response and explanation.",
                    },
                },
                required: ["question", "intention", "answer"],
            },
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    lucideIcon: {
                        type: "string",
                        description:
                            "The Lucide icon representing the skill gap, providing some common five lucide icons for reference. For example, 'code' for programming skills, 'server' for backend development, 'database' for database management, 'cloud' for cloud computing, and 'security' for cybersecurity.",
                    },
                    skill: {
                        type: "string",
                        description:
                            "The skill that is identified as a gap, providing a clear description of the missing competency.",
                    },
                    description: {
                        type: "string",
                        description:
                            "A brief description that explains the skill gap in more detail, highlighting the areas where the candidate may need improvement or further development.",
                    },
                    severity: {
                        type: "string",
                        description:
                            "The severity of the skill gap, indicating how critical it is for the candidate's success in the role. It can be categorized as 'danger', 'medium', or 'high priority'.",
                    },
                },
                required: ["lucideIcon", "skill", "description", "severity"],
            },
        },
        roadmap: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "number",
                        description:
                            "The day number in the roadmap, indicating the sequence of the learning plan.",
                    },
                    topic: {
                        type: "string",
                        description:
                            "The topic or subject to be covered on that day, providing a clear focus for the learning plan.",
                    },
                    advice: {
                        type: "string",
                        description:
                            "The advice or guidance for the candidate on that day, offering practical tips and recommendations for improvement.",
                    },
                },
                required: ["day", "topic", "advice"],
            },
        },
    },
    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "roadmap",
    ],
};

const interviewJsonSchemaZod = z.fromJSONSchema(interviewJsonSchema);

export const generateInterviewReport = async ({
    jobDescription,
    resume,
    selfDescription,
}) => {

    const client = getClient()

    const prompt = `You are an expert in analyzing job descriptions, resumes, and self-descriptions to provide a comprehensive interview report. Your task is to generate a detailed report based on the provided job description, resume, and self-description. The report should include the following sections:
1. Match Score: Evaluate how well the candidate's resume and self-description match the job description. Provide a score from 0 to 100, along with a title and a brief description explaining the score.
2. Technical Questions: Generate a list of technical questions that are relevant to the job description. For each question, provide the intention behind it and the candidate's answer. 
3. Behavioral Questions: Generate a list of behavioral questions that are relevant to the job description. For each question, provide the intention behind it and the candidate's answer.
4. Skill Gaps: Identify any skill gaps based on the job description, resume, and self-description. For each skill gap, provide from some common five Lucide icon representing the skill for example ("code": "code", "cloud": "cloud", "security": "security", "server": "server", "database": "database"), a description of the gap, and its severity (danger, medium, or high priority).
5. Roadmap: Create a roadmap for the candidate to improve their skills and address the identified gaps. For each day in the roadmap, provide the topic to be covered and advice for improvement.
Job Description: ${jobDescription}
Resume: ${resume}
Self Description: ${selfDescription}
Please provide the report in JSON format, adhering to the following schema: ${JSON.stringify(interviewJsonSchema, null, 2)}`;

    const interviewReportService = await client.interactions.create({
        model: "gemini-3.5-flash",
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: interviewJsonSchema,
        },
    });

    const interviewReportProvider = interviewJsonSchemaZod.parse(
        JSON.parse(interviewReportService.output_text)
    );
    
    return interviewReportProvider;
};
