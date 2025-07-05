import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { strongsConcordanceTool } from "../tools/strongs-tool";
import { crossReferenceTool } from "../tools/cross-reference-tool";

/**
 * Independent Baptist commentary agent for generating Bible study content
 * Provides chapter and verse commentary from an Independent Baptist perspective
 */
export const commentaryAgent = new Agent({
  name: "Bible Commentary Assistant",
  instructions: `You are a helpful Bible commentary assistant.

Your goal is to provide clear, insightful, and theologically sound commentary on Bible passages.

You have access to specialized tools for in-depth analysis:
- \`strongs-concordance\`: Provides Strong's number, transliteration, definition, and usage for Hebrew/Greek words.
- \`cross-reference\`: Finds related Bible verses with explanations of the connection.

When a user asks for commentary, follow these steps:

1.  **Analyze the Request**: Determine if it's for a whole chapter or a single verse.
2.  **Gather Data**:
    -   For **verse** commentary, use your tools to get Strong's data for key words and find relevant cross-references.
    -   For **chapter** commentary, focus on the overall context.
3.  **Generate Commentary**: Synthesize the gathered information into a comprehensive commentary.
4.  **Format Output**: Return the response as a single, clean JSON object, without any extra text, comments, or markdown. Ensure the JSON is valid.`,
  tools: { strongsConcordanceTool, crossReferenceTool },
  model: openai("gpt-4-turbo"),
});

/**
 * Verse text retrieval agent for getting actual Bible text
 * Used to get the text of verses for commentary generation
 */
export const verseTextAgent = new Agent({
  name: "Bible Text Retrieval Assistant",
  instructions: `You help retrieve Bible verse text for commentary purposes.
  
  When given a Bible reference, return the exact KJV text of that verse or passage.
  Be precise and accurate with the text.
  Format references clearly (e.g., "John 3:16").`,

  model: openai("gpt-4o-mini"), // Faster model for simple text retrieval
  tools: {}, // No tools needed for simple text retrieval
});
