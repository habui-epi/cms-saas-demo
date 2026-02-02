import { GetServerSideProps } from 'next';
import { getHomePage } from "../homePageQuery";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader('Content-Type', 'text/plain');

    let robotsContent = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/sitemap.xml`;

    const homePage = await getHomePage();

    // EnableRobotsConfiguration only available in AiSeoGeoExperience type
    // Production doesn't have this type, so we access it safely
    const isRobotsEnabled = (homePage as any)?.EnableRobotsConfiguration;

    if (homePage) {
        console.log(`Found home page: ${homePage._metadata?.displayName} at ${homePage._metadata?.url?.default}`);
    }

    if (isRobotsEnabled === false) {
        // If robots is disabled, disallow all crawlers
        robotsContent = `User-agent: *
Disallow: /`;
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