import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmails(subject: string, matter: string, attachment: Express.Multer.File, emails: string[], senderEmail: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: senderEmail, pass: 'apfk mhmb ocyi teeh' }, // Use app password
    });

    const emailPromises = emails.map((email) =>
      transporter.sendMail({
        from: senderEmail,
        to: email,
        subject,
        text: matter,
        attachments: attachment ? [{ path: attachment.path }] : [],
      }),
    );

    await Promise.all(emailPromises); // Send all emails
  }
}
