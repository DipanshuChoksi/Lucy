import { Request, Response } from 'express';
import { llmServer } from '../services/llm.service';

export class LLMController {
  async generateContent(req: Request, res: Response) {
    try {
      const { systemInstruction, userPrompt } = req.body;

      if (!systemInstruction || !userPrompt) {
        return res.status(400).json({ error: 'systemInstruction and userPrompt are required' });
      }

      const generatedText = await llmServer.generateContent(systemInstruction, userPrompt);

      return res.json({ text: generatedText });
    } catch (error) {
      console.error('Error in LLMController.generateContent:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const llmController = new LLMController();
