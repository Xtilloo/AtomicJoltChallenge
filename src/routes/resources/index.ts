import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { BodySchema } from '../../schemas/resources';
import { TFilm, TPeople, TPlanets, TSpecies, TStarship, TVehicles } from '../../lib/types';
import { getCachedResource, getResource, populateResources } from '../../lib/helpers';

const app = new OpenAPIHono();

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
    };

    // Get People
    if (resourceTypes.includes("people")) {
        try{
            data.people = await getCachedResource<TPeople>("people", async () => {
                const people = await getResource<TPeople>("people"); 
                await populateResources(people, ["films", "vehicles", "species", "starships"])
                return people;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Films
    if (resourceTypes.includes("films")) {
        try{
            data.films = await getCachedResource<TFilm>("films", async () => {
                const films = await getResource<TFilm>("films");
                await populateResources(films, ["planets", "vehicles", "species", "starships"]);
                return films;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Starships
    if (resourceTypes.includes("starships")) {
        try{
            data.starships = await getCachedResource<TStarship>("starships", async () => {
                const starships = await getResource<TStarship>("starships");
                await populateResources(starships, ["films", "pilots"]);
                return starships;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Vehicles
    if (resourceTypes.includes("vehicles")) {
        try{
            data.vehicles = await getCachedResource<TVehicles>("vehicles", async () => {
                const vehicles = await getResource<TVehicles>("vehicles");
                await populateResources(vehicles, ["films", "pilots"]);
                return vehicles;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Species
    if (resourceTypes.includes("species")) {
        try{
            data.species = await getCachedResource<TSpecies>("species", async () => {
                const species = await getResource<TSpecies>("species");
                await populateResources(species, ["films", "people"]);
                return species;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    // Get Planets
    if (resourceTypes.includes("planets")) {
        try{
            data.planets = await getCachedResource<TPlanets>("planets", async () => {
                const planets = await getResource<TPlanets>("planets");
                await populateResources(planets, ["films", "residents"]);
                return planets;
            })
        }
        catch (error) {
            console.error("Error getting people", error);
        }
    }

    return c.json({
        data,
    });
});

export default app;