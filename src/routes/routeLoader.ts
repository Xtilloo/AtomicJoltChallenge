import { OpenAPIHono } from "@hono/zod-openapi";
import fg from "fast-glob";
import path from "path";
import { pathToFileURL } from "url";

export async function loadRoutes(): Promise<OpenAPIHono> {
  const router = new OpenAPIHono();
  const currentFile = pathToFileURL(import.meta.url).pathname;
  const currentDir = path.dirname(currentFile);
  console.log(`Loading routes from directory: ${currentDir}`);

  const isProd = currentDir.includes("dist");
  const routesRoot = isProd
    ? "dist/routes/**/*.js" // dist/routes
    : "src/routes/**/*.ts"; // src/routes

  const routeFiles = await fg(routesRoot, {
    ignore: ["dist/routes/routeLoader.js", "src/routes/routeLoader.ts"],
  });

  for (const file of routeFiles) {
    const fullPath = path.resolve(file);
    const mod = await import(pathToFileURL(fullPath).href);

    const route = mod.default;
    if (!route) {
      console.warn(`No default export in route file: ${file}`);
      continue;
    }

    // Derive path from file structure
    // examples:
    //   src/routes/users.js           → /users
    //   src/routes/course/index.js    → /course
    //   src/routes/course/lessons.js  → /course/lessons
    let routePath = file
      .replace(/^(dist|src)\/routes/, "")
      .replace(/\.(js|ts)$/, "")
      .replace(/index$/, "")
      .replace(/\/$/, "");

    if (!routePath.startsWith("/")) routePath = "/" + routePath;

    router.route(routePath, route);

    console.log(`Loaded route: ${routePath}`);
  }

  return router;
}