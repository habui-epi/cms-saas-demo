import { getIntrospectionQuery, printSchema, buildClientSchema } from "graphql";
import fetch from "node-fetch";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const GRAPH_URL = process.env.GRAPH_URL;
const GRAPH_SINGLE_KEY = process.env.GRAPH_SINGLE_KEY;

if (!GRAPH_URL || !GRAPH_SINGLE_KEY) {
    console.error("GRAPH_URL or GRAPH_SINGLE_KEY is missing in .env.local");
    process.exit(1);
}

const endpoint = `https://${GRAPH_URL}/content/v2?auth=${GRAPH_SINGLE_KEY}`;

fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
})
    .then(res => res.json())
    .then((result) => {
        if (result.errors) {
            console.error("Schema introspection failed:", result.errors);
            process.exit(1);
        }
        const schema = buildClientSchema(result.data);
        const sdl = printSchema(schema);
        fs.writeFileSync("schema.graphql", sdl);
        console.log("Schema saved to schema.graphql");
    })
    .catch(err => {
        console.error("Error fetching schema:", err);
        process.exit(1);
    });
