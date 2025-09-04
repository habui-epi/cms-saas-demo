import { GetServerSideProps } from 'next';
import { getHomePage } from "../homePageQuery";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader('Content-Type', 'text/plain');
    const homePage = await getHomePage();

    const isLLMEnabled = homePage?.EnableLLMConfiguration;

    if (homePage) {
        console.log(`Found home page: ${homePage._metadata?.displayName} at ${homePage._metadata?.url?.default}`);
    }

    let llmsContent: string | null | undefined = `# Large Language Model Configuration
# LLM crawling is disabled for this site

User-agent: *
Disallow: /

# No content available for LLM training or usage
`;

    if (isLLMEnabled && llmsContent) {
        llmsContent = homePage?.ApplicationGEO;
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