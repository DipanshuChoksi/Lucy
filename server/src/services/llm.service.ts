import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import { ILLMService, IChatSession, ILLMResponse } from './llm.interface';

// Wrapper to make Gemini's ChatSession compatible with IChatSession
class GeminiChatSessionWrapper implements IChatSession {
  constructor(private session: ChatSession) {}

  async sendMessage(message: string): Promise<ILLMResponse> {
    const result = await this.session.sendMessage(message);
    return {
      response: {
        text: () => result.response.text(),
      },
    };
  }
}

export class GeminiLLMService implements ILLMService {
  private readonly genAI: GoogleGenerativeAI;

  /**
   * Initializes the Gemini API client.
   * @param apiKey The Gemini API key. Defaults to process.env.GEMINI_API_KEY.
   */
  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Cannot initialize LLM client.');
    }
    this.genAI = new GoogleGenerativeAI(key);
  }

  /**
   * Sends a prompt to the LLM (Gemini) with a given system instruction.
   * @param systemInstruction The system prompt / context to guide the LLM behavior.
   * @param userPrompt The actual prompt from the user or system to generate a response for.
   * @returns The generated text.
   */
  public async generateContent(systemInstruction: string, userPrompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction,
    });

    try {
      const result = await Promise.race([
        model.generateContent(userPrompt),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('LLM_TIMEOUT')), 30000)
        )
      ]);
      const response = result.response;
      return response.text();
    } catch (error) {
      if (error instanceof Error && error.message === 'LLM_TIMEOUT') {
        console.error('LLM Timeout: Request exceeded 30 seconds.');
        throw new Error('LLM request timed out. Please try again later.');
      }
      console.error('Error generating content from LLM:', error);
      throw new Error('Failed to generate content from LLM gateway.');
    }
  }

  /**
   * Initializes a stateful chat session with the given system instruction.
   * @param systemInstruction The system prompt / context to guide the LLM behavior.
   * @returns An IChatSession object that can be used to send messages and maintain history.
   */
  public startChat(systemInstruction: string): IChatSession {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      systemInstruction,
    });

    return new GeminiChatSessionWrapper(model.startChat());
  }
}