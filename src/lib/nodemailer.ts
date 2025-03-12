import nodeMailer, { TransportOptions } from "nodemailer"

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST as string,
        port: parseInt(process.env.SMPT_PORT || '587'),
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    } as TransportOptions);

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}