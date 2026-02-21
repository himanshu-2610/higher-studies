import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, subject, message, category } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Website Contact" <${process.env.EMAIL_USER}>`,
            to: "himanshu.dhakad23@pccoepune.org", // 👈 Put your receiving email
            subject: `New Form Submission: ${subject}`,
            html: `
                <h3>New Message Received</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        });

        return res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Email sending failed" });
    }
}