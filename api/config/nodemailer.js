import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const setupTransporter = async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: "live.smtp.mailtrap.io",
            port: 587,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS
            }
        });
        return transporter;
    } catch (error) {
        console.error("Error setting up transporter:", error);
        throw error;
    }
};

// We call the setupTransporter function immediately to create and export the transporter
const transporterPromise = setupTransporter();

export default transporterPromise;

