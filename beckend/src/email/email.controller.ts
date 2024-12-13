import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from './email.service';
import multer from 'multer';

@Controller('api')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-emails')
  @UseInterceptors(FileInterceptor('attachment', { storage: multer?.memoryStorage() }))
  async sendEmails(
    @Body('subject') subject: string,
    @Body('matter') matter: string,
    @UploadedFile() attachment: Express.Multer.File,
    @Body('emails') emails: string[any], // Expecting array
    @Body('senderEmail') senderEmail: string,
  ) {
    const emailArray = JSON.parse(emails); // Parse emails array from JSON string

    await this.emailService.sendEmails(subject, matter, attachment, emailArray, senderEmail);
  }
}
