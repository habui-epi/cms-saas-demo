import { graphql } from "@generated/graphql/gql";

export const SEOFragment = graphql(/* GraphQL */ `
  fragment SEOFragment on AiSeoGeoExperience {
    Title
    MetaTitle
    MetaDescription
    Keywords
    CanonicalUrl {
      default
    }
    OgTitle
    OgDescription
    OgImage {
      url {
        default
      }
    }
    TwitterTitle
    TwitterDescription
    TwitterImage {
      url {
        default
      }
    }
    EnableRobotsConfiguration
    EnableLLMConfiguration
  }
`);