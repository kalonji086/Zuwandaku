import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  generate(@Body() dto: GenerateDocumentDto, @Res() res: Response) {
    const html = this.documentsService.generate(dto);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }

  // Aperçu sans auth pour le frontend en temps réel
  @Post('preview')
  preview(@Body() dto: GenerateDocumentDto, @Res() res: Response) {
    const html = this.documentsService.generate(dto);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
}
