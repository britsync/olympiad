const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'britsyncuk@gmail.com',
        pass: 'nejx qgjw ucjn psxb'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'britsyncuk@gmail.com',
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw, just log. We don't want to break registration if email fails.
        return null;
    }
};

module.exports = { sendEmail };
