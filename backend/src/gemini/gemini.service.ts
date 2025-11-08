import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';

@Injectable()
export class GeminiService {
  constructor() {}
  async blendImages(
    portrait: { data: string; mimeType: string },
    apparel: { data: string; mimeType: string },
  ) {
    try {
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
      console.log('Gemini AI client initialized', ai);
      // Updated prompt to explicitly request full outfit replacement and removal of old clothing
      const prompt = `Replace the clothing on the person in the first image (portrait) with the apparel from the second image. The original clothing must be entirely removed, and only the new apparel should be visible on the person. Ensure the new garment fits seamlessly and realistically, matching lighting, shadows, and the person's pose and background.`;

      const response: GenerateContentResponse = await ai.models.generateContent(
        {
          model: 'gemini-2.5-flash-image', // Using a model capable of image generation/editing
          contents: {
            parts: [
              { inlineData: portrait },
              { inlineData: apparel },
              { text: prompt },
            ],
          },
          config: {
            responseModalities: [Modality.IMAGE], // Requesting an image response
          },
        },
      );

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error('Error blending images with Gemini API:', error);
      throw new Error('Failed to blend images. Please try again.');
    }
  }
}
