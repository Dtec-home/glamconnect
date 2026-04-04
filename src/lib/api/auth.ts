import { gql } from "graphql-request";

import { graphqlClient } from "@/lib/graphql-client";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  is_provider: boolean;
  is_client: boolean;
};

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

const registerMutation = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        id
        username
        email
        is_provider
        is_client
      }
    }
  }
`;

const loginMutation = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        username
        email
        is_provider
        is_client
      }
    }
  }
`;

export async function register(input: {
  username: string;
  email: string;
  password: string;
  role: "provider" | "client";
}) {
  const result = await graphqlClient.request<{ register: AuthPayload }>(
    registerMutation,
    {
      data: input,
    },
  );

  return result.register;
}

export async function login(input: { username: string; password: string }) {
  const result = await graphqlClient.request<{ login: AuthPayload }>(
    loginMutation,
    {
      data: input,
    },
  );

  return result.login;
}
