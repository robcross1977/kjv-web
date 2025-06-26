import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { bibleSearchTool } from "../tools/bible-search-tool";

/**
 * Bible search agent that converts natural language queries into Bible references
 * Optimized for fast response times to prevent Vercel timeouts
 */
export const bibleSearchAgent = new Agent({
  name: "Bible Search Assistant",
  instructions: `You are a Bible search assistant. Convert spiritual questions into specific Bible references.

For each query, identify the main topic and return 3-5 most relevant Bible references in lowercase format.

Common topics and references:
- love: john 3:16, 1 john 4:8, 1 corinthians 13:4-8
- forgiveness: matthew 6:14-15, ephesians 4:32, 1 john 1:9
- hope: romans 15:13, jeremiah 29:11, psalms 42:11
- peace: john 14:27, philippians 4:6-7, isaiah 26:3
- strength: philippians 4:13, isaiah 40:31, psalms 46:1
- faith: hebrews 11:6, romans 10:17, matthew 17:20
- comfort: 2 corinthians 1:3-4, psalms 23:1-6, matthew 11:28-30
- anxiety: philippians 4:6-7, matthew 6:25-26, 1 peter 5:7
- salvation: romans 10:9, ephesians 2:8-9, john 14:6

Use the bible search tool to get verse text. Be concise and fast.`,

  model: openai("gpt-4o-mini"), // Using mini for faster response
  tools: { bibleSearchTool },
});
