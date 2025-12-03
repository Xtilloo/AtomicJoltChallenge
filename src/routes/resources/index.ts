import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { BodySchema } from '../../schemas/resources';
import { TFilm, TPeople, TPlanets, TSpecies, TStarship, TVehicles } from '../../../lib/types';
import { swapiClient } from '../../clients/swapi-client';
import { populateResources } from '../../../lib/helpers';

const app = new OpenAPIHono();

const BASE_URL = process.env.SERVER_URL || "http://localhost:3000/api";

const route = createRoute({
    method: "post",
    path: "/",
    request: {
        body: {
            description: "Endpoint to gather resources from SWAPI",
            required: true,
            content: {
                "application/json": { schema: BodySchema }
            }
        },
    },
    responses: {
        200: {
            description: "Resources received",
        }
    }
    
});

type resources = {
    people: TPeople[],
    films: TFilm[],
    starships: TStarship[],
    vehicles: TVehicles[],
    species: TSpecies[],
    planets: TPlanets[],
}

app.openapi(route, async (c) => {
    const body = c.req.valid("json");
    let resourceTypes = body.resources;

    console.log(`Received resources`, resourceTypes);

    const data: resources = {
        people: [],
        films: [],
        starships: [],
        vehicles: [],
        species: [],
        planets: []
    }

    // Get People
    if (resourceTypes.includes("people")) {
        try{
            const resource = await getResource<TPeople>('people');
            data.people.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Films
    if (resourceTypes.includes("films")) {
        try{
            const resource = await getResource<TFilm>('films');
            data.films.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Starships
    if (resourceTypes.includes("starships")) {
        try{
            const resource = await getResource<TStarship>('starships');
            data.starships.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Vehicles
    if (resourceTypes.includes("vehicles")) {
        try{
            const resource = await getResource<TVehicles>('vehicles');
            data.vehicles.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Species
    if (resourceTypes.includes("species")) {
        try{
            const resource = await getResource<TSpecies>('species');
            data.species.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Planets
    if (resourceTypes.includes("planets")) {
        try{
            const resource = await getResource<TPlanets>('planets');
            data.planets.push(...resource);
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Because SWAPI returns URL's for things like films and species and vehicles, get the actual data from those URL's (with a depth of 1 to prevent infinite recursion)
    if (data.people.length > 0) {
        await populateResources(data.people, ["films", "vehicles", "species", "starships"]);
    }

    // Update Films
    if (data.films.length > 0) {
        // SWAPI calls people "characters" here
        await populateResources(data.films, ["characters", "planets", "starships", "vehicles", "species"]);
    }

    // Update Starships
    if (data.starships.length > 0) {
        await populateResources(data.starships, ["films", "pilots"]);
    }

    // Update Vehicles
    if (data.vehicles.length > 0) {
        await populateResources(data.vehicles, ["films", "pilots"]);
    }

    // Update Species
    if (data.species.length > 0) {
        await populateResources(data.species, ["films", "people"]);
    }

    // Update Planets
    if (data.planets.length > 0) {
        await populateResources(data.planets, ["films", "residents"]);
    }


    return c.json({
        status: "healthy",
        data,
    });
});

async function getResource<T>(resource: string) {
    let data: T[] = [];
    let link:
        | string
        | undefined = `/${resource}/`;

    while (link) {
        const res: {data: {count: number, next: string, results: T[]}} = await swapiClient.get(link);
        data.push(...res.data.results);
        link = res?.data?.next?.replace("https://swapi.dev/api/", "");
    }

    return data;
}

export default app;