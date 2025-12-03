# AtomicJoltChallenge
Coding Challenge for Atomic Jolt interview

## Star Wars API

A high performance backend API that aggregates data from the SWAPI API. This project focuseson solving common external API challenges, handling dependencies, enforcing concurrency limits, and implementing persistent caching.

---

## Key Features

### 1. Persistent Caching

External APIs like SWAPI can be slow at times. To improve user experience and performance, this SPI implements a read-through caching strategy.

- On the first request to the API, data fetched from SWAPI is cached in a local SQLite database
- Subsequent equests are served almost instantly as resources are pulled from the database
- Old resources are removed from the database after 24 hours to maintain fresh data

### 2. Automated Relationship Resolution

Raw SWAPI responses provide URLS for related resources (ex: films: ["https://swapi.dev/api/films/1/"]). This forces the client to make dozens of additional requests just to display basic information like names or titles.

- This API traverses the response URLs in parallel
- It replaces URLs with usuable data like film titles and character names
- Recursion depth is limited to prevent circular dependency loops

### 3. Concurrency Control & Rate Limiting

To prevent Rate limits from being reached on the external API, requests are managed with a global queue. 

- Server processes a maximum of 10 concurrent requests to SWAPI at any given time

### 4. Sorting and Sanitizing

SWAPI includes strings containing values like: "unknown" or "n/a" which can cause difficulties when trying to sort values. 

- The API implements a generic sort method that santizes numeric strings by removing unwanted characters
- Ensures accurate sorting

---

## Tech Stack

- Runtime: Node.js
- Framework: Hono
- Language: TypeScript
- Database: SQLite (via prisma ORM)
- Validation: Zod & @hono/zod-openapi
- Utilities: 
    - `axios` for HTTP Requests
    - `fastq` for Queue/Concurrency Management
    - `@scalar/hono-api-reference` for Interactive API Documentation

---

## Getting Started

1. Clone & Install

```bash
git clone <url>
cd atomicJoltChallenge
npm install
```

2. Environment Setup

Create a `.env` file in the root directory:

```
AUTH_TOKEN=supersecrettoken
```

3. Database Setup

Initialize the SQLite database using Prisma

```
npx prisma db push
```

4. Run the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## API Documentation

This project includes fully interactive OpenAPI documentation

1. Start the server
2. Visit http://localhost:3000/docs in your browser

---

## Project Structure

```
src/
├── index.ts                # App entry point & Router configuration
├── lib/
│   └── helpers.ts          # Caching logic & Prisma client
│   └── types.ts            # External resource type definitions
├── clients/
│   └── swapi-client        # External API interaction
├── routes/
│   └── routeLoader.ts      # Dynamic route loading
│   └── resources/index.ts  # Endpoint for external resources
│   └── sort/films-by-pop   # Endpoint for sorting films by # of characters
│   └── schemas/            # Route schemas

```
