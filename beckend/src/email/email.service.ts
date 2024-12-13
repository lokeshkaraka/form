import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmails(
    subject: string,
    matter: string,
    attachment: Express.Multer.File,
    emails: string[],
    senderEmail: string,
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: senderEmail, pass: 'apfk mhmb ocyi teeh' }, // Use app password
    });

    // Loop through each recipient and send an email
    for (const email of emails) {
      const mailOptions = {
        from: senderEmail,
        to: email, // Send to one recipient at a time
        subject,
        text: matter,
        attachments: attachment
          ? [
              {
                filename: attachment.originalname,
                content: attachment.buffer,
                contentType: attachment.mimetype,
              },
            ]
          : [],
      };

      console.log('Sending email to:', email);

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }
  }
}
