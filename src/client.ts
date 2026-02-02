import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

interface OptimizelyIntegrationClientConfig {
  cmsUrl: string;
  // Optimizely GraphQL API
  graphUrl: string;
  singleGraphKey: string;
}

export class OptimizelyIntegrationClient extends ApolloClient<NormalizedCacheObject> {
  private config: OptimizelyIntegrationClientConfig;
  private currentToken: string | null = null;

  public get communicationInjector() {
    // return `https://${this.config.cmsUrl}/Util/javascript/communicationInjector.js`;
    return "/scripts/communicationInjector.js";
  }

  constructor(config: OptimizelyIntegrationClientConfig, initialToken?: string | null) {
    const httpLink = createHttpLink({
      uri: `https://${config.graphUrl}/content/v2?auth=${config.singleGraphKey}`,
    });

    // Set up auth link with initial token if available
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: initialToken ? `Bearer ${initialToken}` : "",
      },
    }));

    super({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });

    this.config = config;
    this.currentToken = initialToken || null;
  }

  public refresh(token: string) {
    // Only refresh if token has changed
    if (this.currentToken === token) {
      return;
    }

    this.currentToken = token;

    const httpLink = createHttpLink({
      uri: `https://${this.config.graphUrl}/content/v2?auth=${this.config.singleGraphKey}`,
    });

    this.setLink(
      setContext((_, { headers }) => ({
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      })).concat(httpLink)
    );
  }
}

// Helper function to get preview token from URL (client-side only)
function getInitialPreviewToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("preview_token");
  } catch {
    return null;
  }
}

export const client = new OptimizelyIntegrationClient(
  {
    cmsUrl: process.env.CMS_URL ?? "",
    graphUrl: process.env.GRAPH_URL ?? "",
    singleGraphKey: process.env.GRAPH_SINGLE_KEY ?? "",
  },
  getInitialPreviewToken()
);
