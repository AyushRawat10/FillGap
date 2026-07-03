import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.util.js";
import { ApiResponse } from "../utils/api-response.util.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import {
    emailVerificationMailgenContent,
    sendEmail,
} from "../utils/mail.util.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, emain, password } = req.body;

    if (!username || !email || !password) {
        new ApiError(400, "Required all details");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        new ApiError(409, "User already registered !");
    }

    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified: false,
    });

    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: "Verify Your Email Address | FillGap",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`,
        ),
    });
});

export {
    registerUser
}
