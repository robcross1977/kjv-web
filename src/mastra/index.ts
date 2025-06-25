import { Mastra } from "@mastra/core";
import { bibleSearchAgent } from "./agents/bible-search-agent";

/**
 * Main Mastra configuration for the KJV Bible web application
 * Includes agents for Bible search functionality
 */
export const mastra = new Mastra({
  agents: {
    bibleSearchAgent,
  },
});

export default mastra;
