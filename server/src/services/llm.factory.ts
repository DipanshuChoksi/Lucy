import { ILLMService } from './llm.interface';
import { GeminiLLMService } from './llm.service';
import { LocalLLMService } from './local-llm.service';

export class LLMFactory {
  private static instance: ILLMService;

  public static getService(): ILLMService {
    if (!this.instance) {
      const provider = process.env.LLM_PROVIDER?.toLowerCase() || 'gemini';
      
      if (provider === 'local') {
        console.log('Initializing Local LLM Service...');
        this.instance = new LocalLLMService();
      } else {
        console.log('Initializing Gemini LLM Service...');
        this.instance = new GeminiLLMService();
      }
    }
    return this.instance;
  }
}

export const llmServer = LLMFactory.getService();
