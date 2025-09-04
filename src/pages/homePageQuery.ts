import { graphql } from "@generated/graphql/gql";
import { client } from "../client";

export async function getHomePage() {
    const homePageQuery = graphql(/* GraphQL */ `
        query GetLLMConfig {
            content: AiSeoGeoExperience(
                limit: 1
                where: {
                    _or: [
                        { _metadata: { url: { default: { eq: "/" } } } }
                        { _metadata: { url: { default: { eq: "/en" } } } }
                        { _metadata: { url: { default: { eq: "/home" } } } }
                        { _metadata: { displayName: { eq: "Start" } } }
                        { _metadata: { displayName: { eq: "Home" } } }
                        { _metadata: { displayName: { eq: "Homepage" } } }
                    ]
                }
            ) {
                items {
                    EnableLLMConfiguration
                    EnableRobotsConfiguration
                    ApplicationGEO
                    ApplicationSEO
                    _metadata {
                        url {
                            default
                        }
                        displayName
                    }
                }
            }
        }
    `);
    
    const { data } = await client.query({
        query: homePageQuery,
    });

    // Check if LLM configuration is enabled
    return data?.content?.items?.[0];
}