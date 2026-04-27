import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { promises as fs } from 'fs';

// Lazy import for nodemailer
let nodemailer: any;

export interface SendMailDto {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
  sticker?: string; // 'thumbsup', 'heart', etc
}

@Injectable()
export class MailService {
  private transporter: any;

  constructor(private configService: ConfigService) {
    try {
      // Initialize nodemailer on first use
      if (!nodemailer) {
        nodemailer = require('nodemailer');
      }
      
      this.transporter = nodemailer.createTransporter({
        host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
        port: parseInt(this.configService.get('EMAIL_PORT', '587')),
        secure: false,
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });
    } catch (error) {
      console.log('Email service not initialized:', error);
      // Email service will be unavailable, but app can still start
    }
  }

  async sendMail(dto: SendMailDto) {
    if (!this.transporter) {
      console.log('Email service not available - skipping email:', dto.subject);
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions: any = {
      from: this.configService.get('EMAIL_FROM', 'noreply@zuwandaku.com'),
      to: dto.to,
      subject: dto.subject,
      html: this.addStickerToHtml(dto.html, dto.sticker),
      attachments: await this.processAttachments(dto.attachments),
    };

    return await this.transporter.sendMail(mailOptions);
  }

  private addStickerToHtml(html: string, sticker?: string): string {
    if (!sticker) return html;
    
    const stickers = {
      thumbsup: '👍',
      heart: '❤️',
      star: '⭐',
      fire: '🔥',
      rocket: '🚀',
    };

    const emoji = stickers[sticker as keyof typeof stickers];
    return `${html}<br><div style=\"font-size: 48px; margin-top: 20px;\">${emoji}</div>`;
  }

  private async processAttachments(attachments?: SendMailDto['attachments']): Promise<any[]> {
    if (!attachments) return [];

    const processed: any[] = [];
    for (const att of attachments) {
      if (att.path) {
        const content = await fs.readFile(att.path);
        processed.push({
          filename: att.filename,
          content,
          contentType: this.getMimeType(att.filename),
        });
      } else if (att.content) {
        processed.push({ ...att });
      }
    }
    return processed;
  }

  private getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      png: 'image/png',
      jpg: 'image/jpeg',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
