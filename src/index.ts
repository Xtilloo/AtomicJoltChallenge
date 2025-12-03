import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";
import { loadRoutes } from "./routes/routeLoader.js";
import { bearerAuth } from "hono/bearer-auth";
import "dotenv/config";

const token = process.env.AUTH_TOKEN!;

const app = new OpenAPIHono();

app.use("/api/*", async (c, next) => {
  return bearerAuth({ token })(c, next);
});

app.route("/api/", await loadRoutes());

app.get("/", (c) => {
  return c.redirect("/docs");
});

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Atomic Jolt Challenge",
  },
  security: [{ BearerAuth: [] }],
});

app.get("/docs", Scalar({ url: "/doc" }));

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);