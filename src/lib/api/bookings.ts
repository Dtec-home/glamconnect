import { GraphQLClient, gql } from "graphql-request";

import { getAuthToken } from "@/lib/auth-token";

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql/";

export type Booking = {
  id: string;
  scheduled_for: string;
  status: string;
  provider_notes: string;
  client: {
    username: string;
  };
  service: {
    id: string;
    title: string;
    price: string;
    duration: number;
    provider: {
      user: {
        username: string;
      };
    };
  };
};

function getAuthedClient() {
  const token = getAuthToken();

  return new GraphQLClient(endpoint, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

const createBookingMutation = gql`
  mutation CreateBooking($data: CreateBookingInput!) {
    create_booking(data: $data) {
      id
      scheduled_for
      status
      provider_notes
      client {
        username
      }
      service {
        id
        title
        price
        duration
        provider {
          user {
            username
          }
        }
      }
    }
  }
`;

const updateBookingStatusMutation = gql`
  mutation UpdateBookingStatus($data: UpdateBookingStatusInput!) {
    update_booking_status(data: $data) {
      id
      status
      provider_notes
      scheduled_for
      client {
        username
      }
      service {
        id
        title
        price
        duration
        provider {
          user {
            username
          }
        }
      }
    }
  }
`;

const myClientBookingsQuery = gql`
  query MyClientBookings {
    my_client_bookings {
      id
      scheduled_for
      status
      provider_notes
      client {
        username
      }
      service {
        id
        title
        price
        duration
        provider {
          user {
            username
          }
        }
      }
    }
  }
`;

const myProviderBookingsQuery = gql`
  query MyProviderBookings {
    my_provider_bookings {
      id
      scheduled_for
      status
      provider_notes
      client {
        username
      }
      service {
        id
        title
        price
        duration
        provider {
          user {
            username
          }
        }
      }
    }
  }
`;

export async function createBooking(input: {
  service_id: number;
  scheduled_for: string;
}) {
  const client = getAuthedClient();
  const result = await client.request<{ create_booking: Booking }>(createBookingMutation, {
    data: input,
  });
  return result.create_booking;
}

export async function updateBookingStatus(input: {
  booking_id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  provider_notes?: string;
}) {
  const client = getAuthedClient();
  const result = await client.request<{ update_booking_status: Booking }>(
    updateBookingStatusMutation,
    {
      data: input,
    },
  );
  return result.update_booking_status;
}

export async function getMyClientBookings() {
  const client = getAuthedClient();
  const result = await client.request<{ my_client_bookings: Booking[] }>(
    myClientBookingsQuery,
  );
  return result.my_client_bookings;
}

export async function getMyProviderBookings() {
  const client = getAuthedClient();
  const result = await client.request<{ my_provider_bookings: Booking[] }>(
    myProviderBookingsQuery,
  );
  return result.my_provider_bookings;
}
