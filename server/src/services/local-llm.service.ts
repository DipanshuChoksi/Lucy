import { ILLMService, IChatSession, ILLMResponse } from './llm.interface';

class LocalChatSession implements IChatSession {
  private messages: Array<{ role: string, content: string }> = [];

  constructor(private endpoint: string, systemInstruction: string) {
    if (systemInstruction) {
      this.messages.push({ role: 'system', content: systemInstruction });
    }
  }

  async sendMessage(message: string): Promise<ILLMResponse> {
    this.messages.push({ role: 'user', content: message });

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.LOCAL_LLM_MODEL || 'llama3', // default model name could be overridden
        messages: this.messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Local LLM failed: ${response.statusText}`);
    }

    const data = await response.json();
    const replyContent = data.choices[0].message.content;
    
    this.messages.push({ role: 'assistant', content: replyContent });

    return {
      response: {
        text: () => replyContent,
      },
    };
  }
}

export class LocalLLMService implements ILLMService {
  private endpoint: string;

  constructor() {
    this.endpoint = process.env.LOCAL_LLM_ENDPOINT || 'http://localhost:11434/v1/chat/completions';
  }

  public async generateContent(systemInstruction: string, userPrompt: string): Promise<string> {
    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.LOCAL_LLM_MODEL || 'llama3',
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Local LLM generateContent failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content from Local LLM:', error);
      throw new Error('Failed to generate content from Local LLM gateway.');
    }
  }

  public startChat(systemInstruction: string): IChatSession {
    return new LocalChatSession(this.endpoint, systemInstruction);
  }
}
