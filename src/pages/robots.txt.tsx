import { GetServerSideProps } from 'next';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { graphql } from '@generated/graphql/gql';

const RobotsQuery = graphql(/* GraphQL */ `
  query GetRobotsConfig {
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
        EnableRobotsConfiguration
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
  
  let robotsContent = `User-agent: *
Allow: /

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
      query: RobotsQuery,
    });

    // Check if robots configuration is enabled
    const homePage = data?.content?.items?.[0];
    const isRobotsEnabled = homePage?.EnableRobotsConfiguration;
    
    if (homePage) {
      console.log(`Found home page: ${homePage._metadata?.displayName} at ${homePage._metadata?.url?.default}`);
    }
    
    if (isRobotsEnabled === false) {
      // If robots is disabled, disallow all crawlers
      robotsContent = `User-agent: *
Disallow: /`;
    }
  } catch (error) {
    console.error('Error fetching robots configuration:', error);
    // Use default content on error
  }
  
  res.write(robotsContent);
  res.end();

  return {
    props: {},
  };
};

const RobotsPage = () => {
  return null;
};

export default RobotsPage;