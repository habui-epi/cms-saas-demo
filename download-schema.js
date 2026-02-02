import { getIntrospectionQuery, printSchema, buildClientSchema } from "graphql";
import fetch from "node-fetch";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Check if 'prod' argument is passed to use .env.production
const isProd = process.argv.includes('prod');
const envFile = isProd ? '.env.production' : '.env.local';

dotenv.config({ path: envFile });

const GRAPH_URL = process.env.GRAPH_URL;
const GRAPH_SINGLE_KEY = process.env.GRAPH_SINGLE_KEY;

console.log(`Loading schema from ${envFile} (${GRAPH_URL})`);

if (!GRAPH_URL || !GRAPH_SINGLE_KEY) {
    console.error(`GRAPH_URL or GRAPH_SINGLE_KEY is missing in ${envFile}`);
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
