export type TPeople = {
    birth_year: string,
    eye_color: string,
    films: string[] | TFilm[],
    gender: string,
    hair_color: string,
    height: string,
    homeworld: string,
    mass: string,
    name: string,
    skin_color: string,
    created: string,
    edited: string,
    species: string[] | TSpecies[],
    starships: string[] | TStarship[],
    url: string,
    vehicles: string[] | TVehicles[]
}

export type TFilm = {
    title: string,
    episode_id: number,
    opening_crawl: string,
    director: string,
    producer: string,
    release_date: string,
    characters: string[] | TPeople[]
    species: string[] | TSpecies[],
    starships: string[] | TStarship[],
    vehicles: string[] | TVehicles[],
    planets: string[] | TPlanets[],
    url: string,
    created: string,
    edited: string
}

export type TStarship = {
    name: string,
    model: string,
    starship_class: string,
    manufacturer: string,
    cost_in_credits: string,
    length: string,
    crew: string,
    passengers: string,
    max_atmopshering_speed: string,
    hyperdrive_rating: string,
    MGLT: string,
    cargo_capacity: string,
    consumables: string,
    films: string[],
    pilots: string[],
    url: string,
    created: string,
    edited: string
}

export type TVehicles = {
    name: string,
    model: string,
    manufacturer: string,
    cost_in_credits: string,
    length: string,
    crew: string,
    passengers: string,
    max_atmopshering_speed: string,
    cargo_capacity: string,
    consumables: string,
    films: string[] | TFilm[],
    pilots: string[] | TPeople[],
    url: string,
    created: string,
    edited: string
}

export type TSpecies = {
    name: string,
    classification: string,
    designation: string,
    average_height: string,
    average_lifespan: string,
    eye_colors: string,
    hair_colors: string,
    skin_colors: string,
    language: string,
    homeworld: string,
    people: string[] | TPeople[],
    films: string[] | TFilm[],
    url: string,
    created: string,
    edited: string
}

export type TPlanets = {
    name: string,
    diameter: string,
    rotation_period: string,
    orbital_period: string,
    gravity: string,
    population: string,
    climate: string,
    terrain: string,
    surface_water: string,
    residents: string[] | TPeople[],
    films: string[] | TFilm[],
    url: string,
    created: string,
    edited: string
}
