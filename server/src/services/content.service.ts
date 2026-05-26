import { llmServer } from './llm.service';

const CONTENT_PROCESSOR_PROMPT = `You are an expert technical writer, engineering mentor, and active recall specialist.
Your task is to analyze the provided technical content (e.g., a video transcript) and produce a highly structured Markdown document.

You MUST structure your output EXACTLY into the following 6 sections:

# 1. Title
Generate a concise, technical title for the content.

# 2. Executive Summary
Provide 5–15 dense bullet points containing ONLY important insights. Do not include fluff.

# 3. Detailed Notes
Organize the core material into subsections. You should cover:
- Concepts
- Explanations
- Implementation details
- Examples
- Tradeoffs
- Best practices
- Performance/scaling implications

# 4. Key Engineering Insights
Extract advanced knowledge from the content, including:
- Non-obvious insights
- Mental models
- Optimization strategies
- Architectural philosophies
- Advanced engineering patterns

# 5. Actionable Takeaways
Provide practical applications of the knowledge, such as:
- Practical implementation ideas
- Experiments to run
- Architecture improvements
- Optimization opportunities

# 6. Flashcards
Generate high-quality active recall flashcards based on the content. Format each flashcard clearly as a Q&A pair (e.g., **Q:** ... \\n**A:** ...). Focus your questions on:
- Reasoning
- Architecture
- Workflows
- Tradeoffs
- Debugging
- Performance
- Implementation decisions

Output the response purely in standard Markdown.`;

export class ContentService {
  /**
   * Processes the raw text (e.g., from a YouTube transcript) into structured notes and flashcards.
   * @param text The raw content text to process.
   * @returns A structured Markdown string containing the summary and flashcards.
   */
  public async processContent(text: string): Promise<string> {
    try {
      const generatedMarkdown = await llmServer.generateContent(
        CONTENT_PROCESSOR_PROMPT,
        `Here is the content to process:\n\n${text}`
      );
      return generatedMarkdown;
    } catch (error) {
      console.error('Error processing content via LLM:', error);
      throw new Error('Failed to summarize content and generate flashcards.');
    }
  }
}

export const contentService = new ContentService();
