import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { BodySchema } from '../../../schemas/resources';
import axios from 'axios';
import { getCachedResource, getResource, populateResources, sort } from '@/lib/helpers';
import { TFilm, TPeople } from '@/lib/types';

const app = new OpenAPIHono();

const BASE_URL = process.env.SERVER_URL || "http://localhost:3000/api";


const route = createRoute({
    method: "get",
    path: "/",
    responses: {
        200: {
            description: "flimsByPop received",
        }
    }
    
});

app.openapi(route, async (c) => {
    try{
        console.log(`Received /sort/films-by-pop`);
        const filmsResource = await getCachedResource<TFilm>("films", async () => {
            const films = await getResource<TFilm>("films");
            await populateResources(films, ["characters", "planets", "starships", "vehicles", "species"]);
            return films;
        })

        if (filmsResource && filmsResource.length > 0) {
            sort(filmsResource, 'characters', 'desc');
        }

        const data: {title: string, characters: TPeople[], character_count: number }[] = filmsResource.map((film) => ({
            title: film.title,
            characters: film.characters as TPeople[],
            character_count: film.characters.length
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