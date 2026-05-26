import { GoogleGenerativeAI } from '@google/generative-ai';

export class LLMService {
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
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    try {
      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content from LLM:', error);
      throw new Error('Failed to generate content from LLM gateway.');
    }
  }
}

export const llmServer = new LLMService();