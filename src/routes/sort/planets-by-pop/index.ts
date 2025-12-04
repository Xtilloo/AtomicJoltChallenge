import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { getCachedResource, getResource, populateResources, sort } from '@/lib/helpers';
import { TFilm, TPeople, TPlanets } from '@/lib/types';
import { QuerySchema } from '@/schemas/planetsByPop';

const app = new OpenAPIHono();

const route = createRoute({
    method: "get",
    path: "/",
    request: {
        query: QuerySchema
    },
    responses: {
        200: {
            description: "planets-by-pop received",
        }
    }
    
});

app.openapi(route, async (c) => {
    try{
        console.log(`Received /sort/films-by-pop`);
        
        const order = c.req.valid("query")?.order || "desc"; // Default to descending

        // Verify query
        if (!(order === "asc" || order ==="desc")) {
            // CASE: The query was invalid
            return c.json({
                status: `Invalid Query Provided: ${order}`
            });
        }
        
        const planetsResource = await getCachedResource<TPlanets>("planets", async () => {
            const planets = await getResource<TPlanets>("planets");
            await populateResources(planets, ["residents", "films"]);
            return planets;
        })

        if (planetsResource && planetsResource.length > 0) {
            sort(planetsResource, 'population', order);
        }

        const data: {name: string, population: string, climate: string }[] = planetsResource.map((planet) => ({
            name: planet.name,
            population: planet.population,
            climate: planet.climate
        }));

        return c.json({
            data,
        });
    }
    catch (error) {
        console.log(error);
        return c.json({
            status: "There was an error"
        })
    }
});

export default app;