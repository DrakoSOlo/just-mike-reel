import { defineMcp, type ToolDefinition } from "@lovable.dev/mcp-js";

import getFilmTool from "./tools/get-film";
import getStudioProfileTool from "./tools/get-studio-profile";
import listFilmsTool from "./tools/list-films";

export default defineMcp({
  name: "just-mike-s-reel",
  title: "Just Mike's Reel",
  version: "0.1.0",
  instructions:
    "Public tools for just mike's film portfolio. Use `list_films` to browse the reel, `get_film` for one film's details and YouTube link, and `get_studio_profile` for services, influences and contact details.",
  // Cast: the SDK's tool type predates this project's exactOptionalPropertyTypes.
  tools: [listFilmsTool, getFilmTool, getStudioProfileTool] as unknown as ToolDefinition[],
});
