import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { films, showreel, posterUrl, watchUrl } from "@/data/films";

export default defineTool({
  name: "get_film",
  title: "Get film",
  description: "Get one film from just mike's portfolio by its id, YouTube id, or title.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Film id, YouTube video id, or (part of) the title."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query.toLowerCase();
    const film = [showreel, ...films].find(
      (f) =>
        f.id.toLowerCase() === q ||
        f.mediaId.toLowerCase() === q ||
        f.title.toLowerCase().includes(q),
    );
    if (!film) throw new ToolError(`No film matches "${query}".`);
    const row = {
      id: film.id,
      title: film.title,
      category: film.category,
      year: film.year,
      youtubeId: film.mediaId,
      watchUrl: watchUrl(film),
      posterUrl: posterUrl(film),
      captions: film.captions ?? false,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      structuredContent: { film: row },
    };
  },
});
