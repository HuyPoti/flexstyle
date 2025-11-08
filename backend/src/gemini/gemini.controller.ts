import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BlendImagesDto } from './dto/blend-images.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('blend')
  async blendImages(@Body() dto: BlendImagesDto) {
    return await this.geminiService.blendImages(dto.portrait, dto.apparel);
  }
}