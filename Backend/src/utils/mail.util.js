import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "FillGap",
            link: process.env.FRONTEND_URL,
        },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    try {
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.MAIL_FROM_NAME,
                    email: process.env.MAIL_FROM_EMAIL,
                },
                to: [{ email: options.email }],
                subject: options.subject,
                htmlContent: emailHtml,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
    } catch (error) {
        console.log("Email service failed. Check your BREVO_API_KEY in .env");
        console.error("Error : ", error?.response?.data || error.message);
        throw error;
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: [
                "Welcome to FillGap! 🎉",
                "Thank you for joining our AI-powered interview preparation platform.",
                "To keep your account secure and unlock all features, please verify your email address.",
            ],
            action: {
                instructions:
                    "Click the button below to verify your email address:",
                button: {
                    color: "#FF6B00",
                    text: "verify",
                    link: verificationUrl,
                },
            },
            outro: [
                "This verification link will expire in 10 minutes.",
                "If you didn't create a FillGap account, you can safely ignore this email.",
                "Need help? Simply reply to this email and our team will assist you.",
            ],
            signature: "The FillGap Team",
        },
    };
};

const forgotPasswordMailgenContent = (username, forgotPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: [
                "We received a request to reset the password for your FillGap account.",
                "No worries! You can securely create a new password by clicking the button below.",
            ],
            action: {
                instructions: "Click the button below to reset your password:",
                button: {
                    color: "#FF6B00",
                    text: "Reset Password",
                    link: forgotPasswordUrl,
                },
            },
            outro: [
                "This password reset link will expire in 10 minutes for security reasons.",
                "If you didn't request a password reset, you can safely ignore this email. Your account will remain secure and no changes will be made.",
                "If you're having trouble clicking the button, copy and paste the URL into your browser.",
            ],
            signature: "The FillGap Team",
        },
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};
