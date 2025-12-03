import fastq, { queueAsPromised } from "fastq";
import { swapiClient } from "../src/clients/swapi-client";

const worker = async (url: string) => {
    const res = await swapiClient.get(url.replace('https://swapi.dev/api', ''));
    return res.data;
}

// Limit calls to swapi to 10 at a time
const q: queueAsPromised<string, any> = fastq.promise(worker, 10);

// This pushed urls into the queue and waits for them to finish
export async function fetchBatch(urls: string[], attribute: string) {
    const promises = urls.map(async (url) => {
        const data = await q.push(url);
        return data[attribute];
    });

    return Promise.all(promises);
}

// Helper to populate any list of resources
export async function populateResources(list: any[], attributes: string[]) {
    // Base case: skip resource if length == 0
    if (list.length === 0) return;

    const updates = list.map(async (item) => {
        const fieldPromises = attributes.map(async (key) => {
            // Check if the item has this key and is an array
            if (item[key] && Array.isArray(item[key]) && item[key].length > 0) {

                // Only films use attribute 'title' everything else is 'name'
                const attribute = key === 'films' ? 'title' : 'name';

                const resolvedData = await fetchBatch(item[key], attribute);

                item[key] = resolvedData;
            }
        });
        
        // Wait for all fields on this specific item to update
        await Promise.all(fieldPromises);
    });

    // Wait for all items in the list to finish
    await Promise.all(updates);
}