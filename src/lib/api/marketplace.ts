import { GraphQLClient, gql } from "graphql-request";

import { getAuthToken } from "@/lib/auth-token";

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql/";

export type ProviderSummary = {
  id: string;
  is_verified: boolean;
  location: string;
  bio: string;
  user: {
    username: string;
  };
};

export type Service = {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: number;
};

export type PortfolioImage = {
  id: string;
  image_url: string;
  caption: string;
  service_id: number | null;
  provider_id: number | null;
};

function getAuthedClient() {
  const token = getAuthToken();

  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

const createServiceMutation = gql`
  mutation CreateService($data: CreateServiceInput!) {
    create_service(data: $data) {
      id
      title
      description
      price
      duration
    }
  }
`;

const addPortfolioImageMutation = gql`
  mutation AddPortfolioImage($data: AddPortfolioImageInput!) {
    add_portfolio_image(data: $data) {
      id
      image_url
      caption
      service_id
      provider_id
    }
  }
`;

const myServicesQuery = gql`
  query MyServices {
    my_services {
      id
      title
      description
      price
      duration
    }
  }
`;

const providersQuery = gql`
  query Providers {
    providers {
      id
      is_verified
      location
      bio
      user {
        username
      }
    }
  }
`;

const providerQuery = gql`
  query Provider($providerId: Int!) {
    provider(provider_id: $providerId) {
      id
      is_verified
      location
      bio
      user {
        username
      }
    }
  }
`;

const providerServicesQuery = gql`
  query ProviderServices($providerId: Int!) {
    provider_services(provider_id: $providerId) {
      id
      title
      description
      price
      duration
    }
  }
`;

const portfolioImagesQuery = gql`
  query PortfolioImages($providerId: Int) {
    portfolio_images(provider_id: $providerId) {
      id
      image_url
      caption
      service_id
      provider_id
    }
  }
`;

export async function createService(input: {
  title: string;
  description: string;
  price: number;
  duration: number;
}) {
  const client = getAuthedClient();
  const result = await client.request<{ create_service: Service }>(
    createServiceMutation,
    {
      data: input,
    },
  );
  return result.create_service;
}

export async function addPortfolioImage(input: {
  image_url: string;
  caption?: string;
  service_id?: number;
}) {
  const client = getAuthedClient();
  const result = await client.request<{ add_portfolio_image: PortfolioImage }>(
    addPortfolioImageMutation,
    {
      data: {
        image_url: input.image_url,
        caption: input.caption ?? "",
        service_id: input.service_id ?? null,
      },
    },
  );
  return result.add_portfolio_image;
}

export async function getMyServices() {
  const client = getAuthedClient();
  const result = await client.request<{ my_services: Service[] }>(myServicesQuery);
  return result.my_services;
}

export async function getProviders() {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{ providers: ProviderSummary[] }>(providersQuery);
  return result.providers;
}

export async function getProvider(providerId: number) {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{ provider: ProviderSummary | null }>(
    providerQuery,
    { providerId },
  );
  return result.provider;
}

export async function getProviderServices(providerId: number) {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{ provider_services: Service[] }>(
    providerServicesQuery,
    { providerId },
  );
  return result.provider_services;
}

export async function getProviderPortfolioImages(providerId: number) {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{ portfolio_images: PortfolioImage[] }>(
    portfolioImagesQuery,
    { providerId },
  );
  return result.portfolio_images;
}
