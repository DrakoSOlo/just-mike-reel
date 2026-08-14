import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { films, showreel, posterUrl, watchUrl, type Film } from "@/data/films";

function serialise(film: Film) {
  return {
    id: film.id,
    title: film.title,
    category: film.category,
    year: film.year,
    youtubeId: film.mediaId,
    watchUrl: watchUrl(film),
    posterUrl: posterUrl(film),
  };
}

export default defineTool({
  name: "list_films",
  title: "List films",
  description:
    "List the films in just mike's portfolio, including the showreel, with titles, categories, years and YouTube links.",
  inputSchema: {
    category: z
      .string()
      .trim()
      .min(1)
      .optional()
      .describe("Optional case-insensitive category filter, e.g. 'music video'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const all = [showreel, ...films];
    const items = category
      ? all.filter((f) => f.category.toLowerCase().includes(category.toLowerCase()))
      : all;
    const rows = items.map(serialise);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { count: rows.length, films: rows },
    };
  },
});
