import { User } from "../../../DB/models/User.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { sendEmail } from "../../Utils/nodeMailer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring"

export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new Error("User already exists"));
    }

    if (password !== confirmPassword) {
        return next(new Error("Passwords do not match"));
    }
    req.body.password = await bcrypt.hash(password, 8);;
    /*  if (req.body.accountType === "Service Provider" && !req.file) {
        return next(new Error("CV is required for service providers"));
     } */
    console.log(req.body)
    const user = await User.create(req.body);

    const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET,
    );

    res.status(201).json({
        message: "User registered successfully",
        user,
        token
    });
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Invalid email"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new Error("Invalid password"));
    }
    const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET,
    );

    res.status(200).json({
        message: "User logged in successfully",
        user,
        token
    });

})

export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Email not found"));
    }

    const otp = randomstring.generate({
        length: 6,
        charset: "numeric",
    });

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();


    await sendEmail({
        to: email,
        subject: "Resaltk - Password Reset OTP",
        html: `<p>Here is your OTP code:</p>
           <h2>${otp}</h2>
           <p>This code will expire in 10 minutes.</p>`,
    });

    return res.json({ message: "OTP sent successfully", otp});
});


export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword, confirmNewPassword } = req.body;
    const user = await User.findOne({ email, resetPasswordOTP: otp });
    if (!user) {
        return next(new Error("User not found or invalid OTP"));
    }

    if (newPassword !== confirmNewPassword) {
        return next(new Error("Passwords do not match"));
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
        return next(new Error("OTP has expired"));
    }

    user.password = await bcrypt.hash(newPassword, 8);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await sendEmail({
        to: email,
        subject: "Resaltk - Password Changed",
        html: `<p>Your password has been reset successfully.</p>`,
    });

    return res.json({
        message: "Password reset successfully",
    });
});

export const verifyOTP=asyncHandler(async(req,res,next)=>{
    const { email, otp } = req.body;
    const user = await User.findOne({ email, resetPasswordOTP: otp });
    if (!user) {
        return next(new Error("User not found or invalid OTP"));
    }
    if (!user.resetPasswordExpires || user.resetPasswordExpires < Date.now()) {
    return next(new Error("OTP has expired"));
}

    return res.json({
        message: "OTP verify successfully",
    });

})
