import { llmServer } from './llm.factory';

const CONTENT_PROCESSOR_PROMPT = `You are an expert technical writer, engineering mentor, and active recall specialist.Your task is to analyze the provided technical content(e.g., a video transcript, article, podcast transcript, documentation, presentation, or technical discussion) and produce a highly structured Markdown document.

Your primary goal is to maximize knowledge retention, comprehension, and future reference value while preserving the structure and intent of the original content.

You MUST structure your output EXACTLY into the following 4 sections:

# 1. Executive Summary

Provide 5-20 dense bullet points containing ONLY the most important insights, decisions, patterns, lessons, or conclusions from the content.

  Requirements:
- Focus on high - signal information.
- Avoid repetition.
- Avoid introductory statements and fluff.
- Capture the essence of the content in minimal space.

# 2. Detailed Notes

Create comprehensive notes that mirror the actual topics discussed in the source material.

  IMPORTANT:
- DO NOT force the content into predefined categories such as "Concepts", "Examples", "Tradeoffs", or "Best Practices".
- Instead, identify the major topics, themes, sections, modules, ideas, systems, techniques, workflows, or discussions present in the content and organize the notes around them.
- The structure should feel natural to someone who watched / read the original material.
- A reader should be able to quickly find where a specific topic was discussed without searching through unrelated sections.

For each topic:
- Create a clear heading.
- Explain the topic thoroughly.
- Include relevant definitions, explanations, implementation details, examples, diagrams(in markdown when useful), workflows, architecture discussions, debugging approaches, design decisions, tradeoffs, best practices, security implications, performance considerations, scaling concerns, operational insights, tooling discussions, and lessons learned whenever they appear in the source.
- Preserve important context and reasoning.
- Capture both "what" and "why".
- Maintain logical flow between topics.

When appropriate:
- Include code snippets.
- Include architecture breakdowns.
- Include step - by - step workflows.
- Include comparison tables.
- Include decision rationale.
- Include practical examples.

The Detailed Notes section should serve as a complete reference document for the content.

# 3. Key Engineering Insights

Extract advanced knowledge that may not be obvious to beginners.

Focus on:
- Mental models
- Engineering intuition
- Non-obvious lessons
- Architectural philosophies
- System design patterns
- Optimization strategies
- Scalability considerations
- Reliability principles
- Operational lessons
- Common mistakes and pitfalls
- Decision making frameworks
- Industry best practices

Prioritize insights that experienced engineers would find valuable.

# 4. Actionable Takeaways

Convert the knowledge into practical actions.

Include:
- Things a developer can implement immediately
- Experiments worth trying
- Architecture improvements
- Refactoring opportunities
- Performance optimizations
- Learning exercises
- Project ideas
- Production - readiness improvements
- Checklist - style recommendations when appropriate

Requirements:
- Make recommendations concrete and executable.
- Avoid generic advice.
- Tie recommendations directly to the content.

Output Format Requirements
- You MUST return a single valid JSON object.
- The JSON structure MUST follow this schema:
{
  "executive-summary": {
    "title": "Executive Summary",
    "content": "<markdown content>"
  },
  "detailed-notes": {
    "title": "Detailed Notes",
    "content": "<markdown content>"
  },
  "key-engineering-insights": {
    "title": "Key Engineering Insights",
    "content": "<markdown content>"
  },
  "actionable-takeaways": {
    "title": "Actionable Takeaways",
    "content": "<markdown content>"
  },
  "title": "<meaningful title not exceeding 50 characters>"
}

Rules:
- Generate a concise, meaningful title based on the content for the "title" field. The title MUST NOT exceed 50 characters.
- Each content field MUST contain Markdown-formatted text.
- IMPORTANT: Do NOT use H1 ('#') or H2 ('##') headings inside the markdown content. Use H3 ('###') and below for all headings so they nest properly.
- IMPORTANT: Do NOT use markdown checkboxes (e.g., '[ ]' or '[x]') even for checklists. Use standard bullet points instead.
- Preserve all Markdown formatting inside the string, including:
  - Lists
  - Tables
  - Code blocks
  - Blockquotes
  - Diagrams
- The JSON itself MUST be valid and parseable.
- Escape all JSON special characters correctly.
- Do NOT wrap the JSON inside Markdown code fences.
- Do NOT output any text before or after the JSON object.
- Do NOT include explanations, comments, metadata, or reasoning.
- The response must be directly consumable by software using JSON.parse().
- The title fields must exactly match the section names shown above.
- All generated content must be placed inside the corresponding content fields.
- The top-level JSON object must contain exactly five keys:
  - title
  - executive-summary
  - detailed-notes
  - key-engineering-insights
  - actionable-takeaways
`;

//  If i want to store the entire note into the storage, so that when it is downloaded into 

export class ContentService {
  /**
   * Processes the raw text (e.g., from a YouTube transcript) into structured notes and flashcards.
   * @param text The raw content text to process.
   * @returns A structured Markdown string containing the summary and flashcards.
   */
  public async processContent(text: string): Promise<string> {
    try {
      let generatedJsonStr = await llmServer.generateContent(
        CONTENT_PROCESSOR_PROMPT,
        `Here is the content to process:\n\n${text}`
      );

      generatedJsonStr = generatedJsonStr.trim();
      if (generatedJsonStr.startsWith('```json')) {
        generatedJsonStr = generatedJsonStr.substring(7);
      } else if (generatedJsonStr.startsWith('```')) {
        generatedJsonStr = generatedJsonStr.substring(3);
      }
      if (generatedJsonStr.endsWith('```')) {
        generatedJsonStr = generatedJsonStr.substring(0, generatedJsonStr.length - 3);
      }

      return generatedJsonStr.trim();
    } catch (error) {
      console.error('Error processing content via LLM:', error);
      throw new Error('Failed to summarize content and generate flashcards.');
    }
  }
}

export const contentService = new ContentService();


// { title: string(Same name as the source), tags : strings[], createdAt, , content: string of markdown format,  CoverPage: string}