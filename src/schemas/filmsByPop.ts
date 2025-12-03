import { z } from '@hono/zod-openapi';

const ResourceEnum = z
    .enum(["people", "films"])
    .openapi("filmsByPopType");

export const BodySchema = z.object(
    {
        resources: z.array(ResourceEnum).openapi({ example: ["people", "planets"]}),
    }
).openapi("ResourceRequestBody");