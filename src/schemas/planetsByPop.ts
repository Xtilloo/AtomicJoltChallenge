import { z } from "@hono/zod-openapi";

export const QuerySchema = z.object({
  order: z
    .string()
    .optional()
    .openapi({
      param: { name: "order", in: "query" },
      examples: ["asc", "desc"]
    }),
});