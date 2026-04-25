const nodemailer = require('nodemailer');
const ResponseHandler = require('../../utils/response');
const dotenv = require('dotenv');
dotenv.config();

const sendContactEmail = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS.replace(/'/g, ''),
            },
            tls: {
                rejectUnauthorized: false,
                family: 4, // Force IPv4 to avoid ENETUNREACH on IPv6
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'soumya.bhanjadeo07@gmail.com',
            replyTo: email,
            subject: `New Contact Form Submission: ${subject || 'General'}`,
            html: `
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return ResponseHandler.success(res, null, 'Email sent successfully', 200);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendContactEmail
};
