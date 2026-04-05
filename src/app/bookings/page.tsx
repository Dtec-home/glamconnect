"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";

import {
  getMyClientBookings,
  getMyProviderBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/api/bookings";
import { getMe } from "@/lib/api/auth";
import {
  getMyProviderReviews,
  leaveReview,
  replyToReview,
} from "@/lib/api/reviews";

function filterByTab(bookings: Booking[], tab: "pending" | "upcoming" | "past") {
  const now = Date.now();

  if (tab === "pending") {
    return bookings.filter((booking) => booking.status === "PENDING");
  }
  if (tab === "upcoming") {
    return bookings.filter(
      (booking) =>
        ["ACCEPTED"].includes(booking.status) && new Date(booking.scheduled_for).getTime() >= now,
    );
  }
  return bookings.filter(
    (booking) =>
      ["COMPLETED", "REJECTED"].includes(booking.status) ||
      new Date(booking.scheduled_for).getTime() < now,
  );
}

export default function BookingsPage() {
  const [providerTab, setProviderTab] = useState<"pending" | "upcoming" | "past">("pending");
  const [activeReviewBookingId, setActiveReviewBookingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImageUrl, setReviewImageUrl] = useState("");
  const [providerReplyDrafts, setProviderReplyDrafts] = useState<Record<number, string>>({});
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: getMe });
  const clientBookingsQuery = useQuery({
    queryKey: ["client-bookings"],
    queryFn: getMyClientBookings,
    enabled: !!meQuery.data?.is_client,
  });
  const providerBookingsQuery = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: getMyProviderBookings,
    enabled: !!meQuery.data?.is_provider,
  });
  const providerReviewsQuery = useQuery({
    queryKey: ["provider-reviews"],
    queryFn: getMyProviderReviews,
    enabled: !!meQuery.data?.is_provider,
  });

  const providerUpdateMutation = useMutation({
    mutationFn: updateBookingStatus,
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["provider-bookings"] });
      const previous = queryClient.getQueryData<Booking[]>(["provider-bookings"]);
      queryClient.setQueryData<Booking[]>(["provider-bookings"], (old = []) =>
        old.map((booking) =>
          Number(booking.id) === vars.booking_id
            ? { ...booking, status: vars.status, provider_notes: vars.provider_notes ?? "" }
            : booking,
        ),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["provider-bookings"], context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
    },
  });

  const leaveReviewMutation = useMutation({
    mutationFn: leaveReview,
    onSuccess: async () => {
      setReviewMessage("Review submitted.");
      setActiveReviewBookingId(null);
      setReviewComment("");
      setReviewImageUrl("");
      setReviewRating(5);
      await queryClient.invalidateQueries({ queryKey: ["client-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["provider-reviews"] });
    },
    onError: () => {
      setReviewMessage("Unable to submit review. You may have already reviewed this booking.");
    },
  });

  const replyToReviewMutation = useMutation({
    mutationFn: replyToReview,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["provider-reviews"] });
    },
  });

  const providerBookings = providerBookingsQuery.data ?? [];
  const filteredProviderBookings = useMemo(
    () => filterByTab(providerBookings, providerTab),
    [providerBookings, providerTab],
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-xl font-semibold">Bookings</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Client and provider booking management.
        </p>
      </div>

      {meQuery.data?.is_client ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h2 className="text-base font-semibold">My Client Bookings</h2>
          <ul className="mt-4 space-y-3">
            {clientBookingsQuery.data?.map((booking) => (
              <li key={booking.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{booking.service.title}</p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Provider: {booking.service.provider.user.username}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(booking.scheduled_for).toLocaleString()} • {booking.status}
                </p>

                {booking.status === "COMPLETED" ? (
                  <div className="mt-3 rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">Leave a review</p>
                      <button
                        type="button"
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() =>
                          setActiveReviewBookingId(
                            activeReviewBookingId === Number(booking.id) ? null : Number(booking.id),
                          )
                        }
                      >
                        {activeReviewBookingId === Number(booking.id) ? "Close" : "Review"}
                      </button>
                    </div>

                    {activeReviewBookingId === Number(booking.id) ? (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              className="text-yellow-500"
                              onClick={() => setReviewRating(value)}
                              aria-label={`Rate ${value}`}
                            >
                              <Star
                                size={18}
                                fill={value <= reviewRating ? "currentColor" : "none"}
                              />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={reviewComment}
                          onChange={(event) => setReviewComment(event.target.value)}
                          placeholder="Write your review"
                          className="min-h-20 w-full rounded border px-2 py-1 text-xs"
                        />

                        <input
                          value={reviewImageUrl}
                          onChange={(event) => setReviewImageUrl(event.target.value)}
                          placeholder="Image URL (Cloudinary URL optional)"
                          className="w-full rounded border px-2 py-1 text-xs"
                        />

                        <button
                          type="button"
                          className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                          onClick={() =>
                            leaveReviewMutation.mutate({
                              booking_id: Number(booking.id),
                              rating: reviewRating,
                              comment: reviewComment,
                              image_url: reviewImageUrl,
                            })
                          }
                          disabled={leaveReviewMutation.isPending}
                        >
                          {leaveReviewMutation.isPending ? "Submitting..." : "Submit review"}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          {reviewMessage ? <p className="mt-3 text-xs text-zinc-500">{reviewMessage}</p> : null}
        </div>
      ) : null}

      {meQuery.data?.is_provider ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h2 className="text-base font-semibold">Provider Bookings</h2>
          <div className="mt-3 flex gap-2">
            {(["pending", "upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setProviderTab(tab)}
                className={`rounded px-3 py-1 text-xs font-medium ${
                  providerTab === tab
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "border"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <ul className="mt-4 space-y-3">
            {filteredProviderBookings.map((booking) => (
              <li key={booking.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{booking.service.title}</p>
                <p className="text-zinc-600 dark:text-zinc-300">Client: {booking.client.username}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(booking.scheduled_for).toLocaleString()} • {booking.status}
                </p>

                {booking.status === "PENDING" ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        providerUpdateMutation.mutate({
                          booking_id: Number(booking.id),
                          status: "ACCEPTED",
                        })
                      }
                      className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        providerUpdateMutation.mutate({
                          booking_id: Number(booking.id),
                          status: "REJECTED",
                        })
                      }
                      className="rounded bg-red-700 px-2 py-1 text-xs text-white"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}

                {booking.status === "ACCEPTED" ? (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        providerUpdateMutation.mutate({
                          booking_id: Number(booking.id),
                          status: "COMPLETED",
                        })
                      }
                      className="rounded border px-2 py-1 text-xs"
                    >
                      Mark completed
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold">Reviews Received</h3>
            <ul className="mt-3 space-y-3">
              {providerReviewsQuery.data?.map((review) => (
                <li key={review.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{review.client.username}</p>
                    <p className="text-xs text-zinc-500">{new Date(review.created_at).toLocaleString()}</p>
                  </div>
                  <div className="mt-1 flex gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} size={14} fill={value <= review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  {review.comment ? <p className="mt-2 text-xs">{review.comment}</p> : null}

                  {review.provider_reply ? (
                    <p className="mt-2 rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                      Reply: {review.provider_reply}
                    </p>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={providerReplyDrafts[Number(review.id)] ?? ""}
                        onChange={(event) =>
                          setProviderReplyDrafts((prev) => ({
                            ...prev,
                            [Number(review.id)]: event.target.value,
                          }))
                        }
                        className="min-h-16 w-full rounded border px-2 py-1 text-xs"
                        placeholder="Write a reply"
                      />
                      <button
                        type="button"
                        className="w-fit rounded border px-2 py-1 text-xs"
                        onClick={() =>
                          replyToReviewMutation.mutate({
                            review_id: Number(review.id),
                            provider_reply: providerReplyDrafts[Number(review.id)] ?? "",
                          })
                        }
                        disabled={replyToReviewMutation.isPending}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
