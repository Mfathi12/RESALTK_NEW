import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    // sender
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS, // لازم App Password
        },
    });

    // receiver
    const mailOptions = {
        from: `"Resaltk Application 📑" <${process.env.USER}>`, // مهم يكون ايميل
        to,
        subject,
        html, // لازم تبعتي محتوى
    };

    const info = await transporter.sendMail(mailOptions);

    if (info.rejected.length > 0) return false;
    return true;
};
