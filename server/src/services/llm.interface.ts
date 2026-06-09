export interface ILLMResponse {
  response: {
    text(): string;
  };
}

export interface IChatSession {
  sendMessage(message: string): Promise<ILLMResponse>;
}

export interface ILLMService {
  generateContent(systemInstruction: string, userPrompt: string): Promise<string>;
  startChat(systemInstruction: string): IChatSession;
}
