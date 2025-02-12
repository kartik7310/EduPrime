import nodemailer from "nodemailer";

export const mailSender = async (email, title, body) => {
  try {
  
    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT || 587, 
      secure: process.env.MAIL_PORT === "465", 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"EduPrime Coaching Center" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });
    console.log(info);
    
    console.log(`Email sent successfully to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Error in mailSender: ${error.message}`);
    throw error;
  }
};
