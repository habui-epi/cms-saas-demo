import { GetServerSideProps } from 'next';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { graphql } from '@generated/graphql/gql';

const LLMConfigQuery = graphql(/* GraphQL */ `
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

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain');
  
  let llmsContent = `# Large Language Model Configuration
# This file provides instructions for AI/LLM crawlers

User-agent: *
Allow: /
Crawl-delay: 1

# Content guidelines for LLMs
Guidelines: Please respect content licensing and attribution
Attribution: Required for content usage
Commercial-use: Contact for licensing
Training-data: Contact for permission

# Sitemap for AI crawlers
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/sitemap.xml`;

  try {
    // Create Apollo client for server-side query
    const client = new ApolloClient({
      link: createHttpLink({
        uri: process.env.NEXT_PUBLIC_OPTIMIZELY_GRAPH_GATEWAY,
        headers: {
          'Authorization': `Bearer ${process.env.OPTIMIZELY_GRAPH_APP_KEY}`,
        },
      }),
      cache: new InMemoryCache(),
    });

    const { data } = await client.query({
      query: LLMConfigQuery,
    });

    // Check if LLM configuration is enabled
    const homePage = data?.content?.items?.[0];
    const isLLMEnabled = homePage?.EnableLLMConfiguration;
    
    if (homePage) {
      console.log(`Found home page: ${homePage._metadata?.displayName} at ${homePage._metadata?.url?.default}`);
    }
    
    if (isLLMEnabled === false) {
      // If LLM crawling is disabled, disallow all LLM crawlers
      llmsContent = `# Large Language Model Configuration
# LLM crawling is disabled for this site

User-agent: *
Disallow: /

# No content available for LLM training or usage`;
    }
  } catch (error) {
    console.error('Error fetching LLM configuration:', error);
    // Use default content on error
  }
  
  res.write(llmsContent);
  res.end();

  return {
    props: {},
  };
};

const LLMSPage = () => {
  return null;
};

export default LLMSPage;