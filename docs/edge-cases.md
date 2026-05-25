- Content Ingestor Fallbacks: What happens if the YouTube video has closed captions disabled or the technical article is behind a paywall?

-Recommendation: Add an acceptance criteria to gracefully inform the user when transcript/content extraction fails, rather than crashing silently.

- SQL Sandbox Timeouts: If a user submits a highly unoptimized query (e.g., an accidental cross join on a large table), it could tie up the database resources or timeout the webhook.

-Recommendation: We must enforce a strict statement_timeout (e.g., 5 seconds) at the PostgreSQL user level to kill runaway queries.

- DSA Coach Parsing: What if the user submits code but doesn't specify the language, or submits a screenshot instead of text?

-Recommendation: Limit V1 to text-based code snippets and rely on the LLM to auto-detect the language. Explicitly mark image-to-text OCR as Out of Scope for V1.

- Webhook Timeouts: Telegram requires webhooks to respond quickly. Hitting an LLM or fetching a YouTube transcript might take 5-10 seconds.

-Recommendation: We should acknowledge the webhook immediately and process the LLM call asynchronously, then send the response back via the Telegram Send Message API.