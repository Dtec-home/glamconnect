import { GraphQLClient, gql } from "graphql-request";

import { getAuthToken } from "@/lib/auth-token";

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql/";

export type Review = {
  id: string;
  booking_id: number;
  rating: number;
  comment: string;
  image_url: string;
  provider_reply: string;
  created_at: string;
  client: {
    username: string;
  };
};

export type ProviderRatingSummary = {
  average_rating: number;
  review_count: number;
};

function getAuthedClient() {
  const token = getAuthToken();

  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

const leaveReviewMutation = gql`
  mutation LeaveReview($data: LeaveReviewInput!) {
    leave_review(data: $data) {
      id
      booking_id
      rating
      comment
      image_url
      provider_reply
      created_at
      client {
        username
      }
    }
  }
`;

const replyToReviewMutation = gql`
  mutation ReplyToReview($data: ReplyToReviewInput!) {
    reply_to_review(data: $data) {
      id
      booking_id
      rating
      comment
      image_url
      provider_reply
      created_at
      client {
        username
      }
    }
  }
`;

const reviewsForProviderQuery = gql`
  query ReviewsForProvider($providerId: Int!) {
    reviews_for_provider(provider_id: $providerId) {
      id
      booking_id
      rating
      comment
      image_url
      provider_reply
      created_at
      client {
        username
      }
    }
  }
`;

const myProviderReviewsQuery = gql`
  query MyProviderReviews {
    my_provider_reviews {
      id
      booking_id
      rating
      comment
      image_url
      provider_reply
      created_at
      client {
        username
      }
    }
  }
`;

const providerRatingSummaryQuery = gql`
  query ProviderRatingSummary($providerId: Int!) {
    provider_rating_summary(provider_id: $providerId) {
      average_rating
      review_count
    }
  }
`;

export async function leaveReview(input: {
  booking_id: number;
  rating: number;
  comment?: string;
  image_url?: string;
}) {
  const client = getAuthedClient();
  const result = await client.request<{ leave_review: Review }>(leaveReviewMutation, {
    data: {
      booking_id: input.booking_id,
      rating: input.rating,
      comment: input.comment ?? "",
      image_url: input.image_url ?? "",
    },
  });
  return result.leave_review;
}

export async function replyToReview(input: { review_id: number; provider_reply: string }) {
  const client = getAuthedClient();
  const result = await client.request<{ reply_to_review: Review }>(replyToReviewMutation, {
    data: input,
  });
  return result.reply_to_review;
}

export async function getReviewsForProvider(providerId: number) {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{ reviews_for_provider: Review[] }>(
    reviewsForProviderQuery,
    { providerId },
  );
  return result.reviews_for_provider;
}

export async function getMyProviderReviews() {
  const client = getAuthedClient();
  const result = await client.request<{ my_provider_reviews: Review[] }>(myProviderReviewsQuery);
  return result.my_provider_reviews;
}

export async function getProviderRatingSummary(providerId: number) {
  const client = new GraphQLClient(endpoint);
  const result = await client.request<{
    provider_rating_summary: ProviderRatingSummary;
  }>(providerRatingSummaryQuery, {
    providerId,
  });
  return result.provider_rating_summary;
}
