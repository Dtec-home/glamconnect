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

  const filteredProviderBookings = useMemo(
    () => filterByTab(providerBookingsQuery.data ?? [], providerTab),
    [providerBookingsQuery.data, providerTab],
  );

  return (
    <div className="flex w-full flex-col gap-10 pb-10">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your service requests and view client feedback.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {meQuery.data?.is_client && (
          <div className="lg:col-span-12 space-y-4">
            <h2 className="text-xl font-bold px-1">My Client Bookings</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {clientBookingsQuery.data?.map((booking) => (
                <div key={booking.id} className="group relative rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-lg leading-tight">{booking.service.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-600" :
                      booking.status === "REJECTED" ? "bg-accent/10 text-accent" :
                      booking.status === "ACCEPTED" ? "bg-primary/10 text-primary" :
                      "bg-amber-500/10 text-amber-600"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p className="flex items-center gap-2">
                       <span className="font-semibold text-foreground/70">Provider:</span> 
                       {booking.service.provider.user.username}
                    </p>
                    <p>{new Date(booking.scheduled_for).toLocaleString()}</p>
                  </div>

                  {booking.status === "COMPLETED" && (
                    <div className="mt-4 border-t border-border/50 pt-4">
                      <button
                        type="button"
                        className="w-full rounded-xl border border-border/50 py-2 text-xs font-bold transition-colors hover:bg-muted"
                        onClick={() =>
                          setActiveReviewBookingId(
                            activeReviewBookingId === Number(booking.id) ? null : Number(booking.id),
                          )
                        }
                      >
                        {activeReviewBookingId === Number(booking.id) ? "Close Review" : "Leave a Review"}
                      </button>

                      {activeReviewBookingId === Number(booking.id) && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <button
                                key={value}
                                type="button"
                                className={`transition-transform active:scale-90 ${value <= reviewRating ? "text-yellow-500" : "text-muted/30"}`}
                                onClick={() => setReviewRating(value)}
                                aria-label={`Rate ${value}`}
                              >
                                <Star
                                  size={24}
                                  fill={value <= reviewRating ? "currentColor" : "none"}
                                />
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={reviewComment}
                            onChange={(event) => setReviewComment(event.target.value)}
                            placeholder="Share your experience..."
                            className="min-h-24 w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />

                          <input
                            value={reviewImageUrl}
                            onChange={(event) => setReviewImageUrl(event.target.value)}
                            placeholder="Image URL (optional)"
                            className="w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          />

                          <button
                            type="button"
                            className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
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
                            {leaveReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {reviewMessage && (
              <p className="rounded-xl bg-muted/50 p-3 text-center text-xs font-medium text-foreground/70">
                {reviewMessage}
              </p>
            )}
          </div>
        )}

        {meQuery.data?.is_provider && (
          <div className="lg:col-span-12 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
              <h2 className="text-xl font-bold">Provider Dashboard</h2>
              <div className="flex bg-muted p-1 rounded-xl">
                {(["pending", "upcoming", "past"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setProviderTab(tab)}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all uppercase tracking-wider ${
                      providerTab === tab
                        ? "bg-background text-primary shadow-sm"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProviderBookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-lg leading-tight">{booking.service.title}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1">Client: {booking.client.username}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(booking.scheduled_for).toLocaleString()}
                  </p>

                  {booking.status === "PENDING" && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() =>
                          providerUpdateMutation.mutate({
                            booking_id: Number(booking.id),
                            status: "ACCEPTED",
                          })
                        }
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
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
                        className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {booking.status === "ACCEPTED" && (
                    <div className="pt-2 border-t border-border/50">
                      <button
                        type="button"
                        onClick={() =>
                          providerUpdateMutation.mutate({
                            booking_id: Number(booking.id),
                            status: "COMPLETED",
                          })
                        }
                        className="w-full rounded-xl border border-border/50 py-2 text-xs font-bold hover:bg-muted"
                      >
                        Mark Completed
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Reviews Received</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {providerReviewsQuery.data?.map((review) => (
                  <div key={review.id} className="rounded-xl border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-bold">{review.client.username}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star key={value} size={14} fill={value <= review.rating ? "#eab308" : "none"} className={value <= review.rating ? "text-yellow-500" : "text-muted/30"} />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm italic text-foreground/80 mb-4">&ldquo;{review.comment}&rdquo;</p>}

                    {review.provider_reply ? (
                      <div className="rounded-xl bg-background p-3 text-xs border border-border/50">
                        <p className="font-bold text-primary mb-1 text-[10px] uppercase tracking-wide">Your Response:</p>
                        <p>{review.provider_reply}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 mt-4">
                        <textarea
                          value={providerReplyDrafts[Number(review.id)] ?? ""}
                          onChange={(event) =>
                            setProviderReplyDrafts((prev) => ({
                              ...prev,
                              [Number(review.id)]: event.target.value,
                            }))
                          }
                          className="min-h-[80px] w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Write a professional reply..."
                        />
                        <button
                          type="button"
                          className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                          onClick={() =>
                            replyToReviewMutation.mutate({
                              review_id: Number(review.id),
                              provider_reply: providerReplyDrafts[Number(review.id)] ?? "",
                            })
                          }
                          disabled={replyToReviewMutation.isPending}
                        >
                          {replyToReviewMutation.isPending ? "Replying..." : "Post Reply"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
