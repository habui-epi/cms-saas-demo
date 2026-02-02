import { graphql } from "@generated/graphql/gql";

// Commented out - AiSeoGeoExperience not available in production Content Graph (cg.optimizely.com)
// export const SEOFragment = graphql(/* GraphQL */ `
//   fragment SEOFragment on AiSeoGeoExperience {
//     Title
//     MetaTitle
//     MetaDescription
//     Keywords
//     CanonicalUrl {
//       default
//     }
//     OgTitle
//     OgDescription
//     OgImage {
//       url {
//         default
//       }
//     }
//     TwitterTitle
//     TwitterDescription
//     TwitterImage {
//       url {
//         default
//       }
//     }
//     EnableRobotsConfiguration
//     EnableLLMConfiguration
//   }
// `);