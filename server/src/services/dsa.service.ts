import { ChatSession } from '@google/generative-ai';
import { llmServer } from './llm.service';

const SOCRATIC_PROMPT = `You are an expert Data Structures and Algorithms (DSA) Coach.
Your goal is to help the user understand and solve DSA problems using the Socratic method.
Rules you MUST follow:
1. NEVER give the direct solution or complete code snippet to the user immediately.
2. Ask leading questions to help the user arrive at the solution themselves.
3. If the user is stuck, provide a small hint about the approach (e.g., "Have you considered using a hash map?").
4. Validate the user's logic and point out potential edge cases or efficiency issues (time/space complexity) by asking questions (e.g., "What happens if the array is empty?", "Can we do better than O(n^2)?").
5. Keep your responses concise and focused on the next logical step in the problem-solving process.`;

export class DSACoachService {
  private activeSessions: Map<string, ChatSession> = new Map();

  /**
   * Gets an existing chat session for the user, or creates a new one.
   * @param telegramId The user's Telegram ID.
   * @returns A ChatSession object.
   */
  private getOrCreateSession(telegramId: string): ChatSession {
    if (!this.activeSessions.has(telegramId)) {
      const session = llmServer.startChat(SOCRATIC_PROMPT);
      this.activeSessions.set(telegramId, session);
    }
    return this.activeSessions.get(telegramId)!;
  }

  /**
   * Handles a message from the user, passing it to the LLM coach.
   * @param telegramId The user's Telegram ID.
   * @param message The user's message.
   * @returns The coach's response.
   */
  public async handleMessage(telegramId: string, message: string): Promise<string> {
    try {
      const session = this.getOrCreateSession(telegramId);
      const result = await session.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Error handling message for ${telegramId}:`, error);
      throw new Error('Failed to communicate with the DSA Coach.');
    }
  }

  /**
   * Resets the user's chat session.
   * @param telegramId The user's Telegram ID.
   */
  public resetSession(telegramId: string): void {
    this.activeSessions.delete(telegramId);
  }
}

export const dsaCoachService = new DSACoachService();
