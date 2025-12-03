import { z } from '@hono/zod-openapi';

const ResourceEnum = z
    .enum(["people", "films", "starships", "vehicles", "species", "planets"])
    .openapi("ResourceType");

export const BodySchema = z.object(
    {
        resources: z.array(ResourceEnum).openapi({ example: ["people", "planets"]}),
    }
).openapi("ResourceRequestBody");
