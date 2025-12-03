import axios from 'axios';

const config = {
    baseURL: "https://swapi.dev/api/",
    headers: {
        "Content-Type": 'application/json'
    }
}

export const swapiClient = axios.create(config);