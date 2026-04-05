"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import { VerificationBadge } from "@/components/providers/verification-badge";
import { createBooking } from "@/lib/api/bookings";
import {
  getProvider,
  getProviderPortfolioImages,
  getProviderServices,
} from "@/lib/api/marketplace";
import { getProviderRatingSummary, getReviewsForProvider } from "@/lib/api/reviews";

export default function ProviderProfilePage() {
  const params = useParams<{ id: string }>();
  const providerId = Number(params.id);

  const providerQuery = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => getProvider(providerId),
    enabled: Number.isFinite(providerId),
  });

  const servicesQuery = useQuery({
    queryKey: ["provider-services", providerId],
    queryFn: () => getProviderServices(providerId),
    enabled: Number.isFinite(providerId),
  });

  const imagesQuery = useQuery({
    queryKey: ["provider-images", providerId],
    queryFn: () => getProviderPortfolioImages(providerId),
    enabled: Number.isFinite(providerId),
  });

  const ratingSummaryQuery = useQuery({
    queryKey: ["provider-rating-summary", providerId],
    queryFn: () => getProviderRatingSummary(providerId),
    enabled: Number.isFinite(providerId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["provider-reviews", providerId],
    queryFn: () => getReviewsForProvider(providerId),
    enabled: Number.isFinite(providerId),
  });

  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  if (providerQuery.isLoading) {
    return <section className="w-full">Loading provider profile...</section>;
  }

  if (providerQuery.isError || !providerQuery.data) {
    return <section className="w-full text-red-600">Provider not found.</section>;
  }

  const provider = providerQuery.data;

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{provider.user.username}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {provider.location || "Location not set"}
            </p>
          </div>
          {provider.is_verified ? <VerificationBadge /> : null}
        </div>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          {provider.bio || "No bio available."}
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="font-medium">Rating:</span>
          <span>
            {ratingSummaryQuery.data?.average_rating?.toFixed(2) ?? "0.00"} / 5
          </span>
          <span className="text-zinc-500">
            ({ratingSummaryQuery.data?.review_count ?? 0} reviews)
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="text-base font-semibold">Services</h2>
        {servicesQuery.isLoading ? <p className="mt-3 text-sm">Loading services...</p> : null}
        {servicesQuery.isError ? (
          <p className="mt-3 text-sm text-red-600">Unable to load services.</p>
        ) : null}

        <ul className="mt-4 space-y-3">
          {servicesQuery.data?.map((service) => (
            <li key={service.id} className="rounded-lg border p-3">
              <p className="font-medium">{service.title}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                {service.description}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                ${service.price} • {service.duration} mins
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="datetime-local"
                  className="rounded border px-2 py-1 text-xs"
                  value={bookingDateTime}
                  onChange={(event) => setBookingDateTime(event.target.value)}
                />
                <button
                  type="button"
                  className="rounded bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  onClick={async () => {
                    if (!bookingDateTime) {
                      setBookingMessage("Choose date/time before booking.");
                      return;
                    }

                    try {
                      await createBooking({
                        service_id: Number(service.id),
                        scheduled_for: new Date(bookingDateTime).toISOString(),
                      });
                      setBookingMessage("Booking created successfully.");
                    } catch {
                      setBookingMessage("Unable to create booking. Ensure you are logged in as client.");
                    }
                  }}
                >
                  Book Now
                </button>
              </div>
            </li>
          ))}
        </ul>
        {bookingMessage ? (
          <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-300">{bookingMessage}</p>
        ) : null}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="text-base font-semibold">Portfolio</h2>
        {imagesQuery.isLoading ? <p className="mt-3 text-sm">Loading images...</p> : null}
        {imagesQuery.isError ? (
          <p className="mt-3 text-sm text-red-600">Unable to load images.</p>
        ) : null}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {imagesQuery.data?.map((image) => (
            <li key={image.id} className="rounded-lg border p-2">
              <Image
                src={image.image_url}
                alt={image.caption || "Portfolio image"}
                className="h-32 w-full rounded object-cover"
                width={420}
                height={220}
              />
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                {image.caption || "No caption"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h2 className="text-base font-semibold">Reviews</h2>
        {reviewsQuery.isLoading ? <p className="mt-3 text-sm">Loading reviews...</p> : null}
        {reviewsQuery.isError ? (
          <p className="mt-3 text-sm text-red-600">Unable to load reviews.</p>
        ) : null}

        <ul className="mt-4 space-y-3">
          {reviewsQuery.data?.map((review) => (
            <li key={review.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{review.client.username}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-1 flex gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star key={value} size={14} fill={value <= review.rating ? "currentColor" : "none"} />
                ))}
              </div>
              {review.comment ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{review.comment}</p>
              ) : null}
              {review.image_url ? (
                <Image
                  src={review.image_url}
                  alt="Review attachment"
                  className="mt-2 h-32 w-full rounded object-cover sm:w-56"
                  width={420}
                  height={220}
                />
              ) : null}
              {review.provider_reply ? (
                <p className="mt-2 rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-800">
                  Provider reply: {review.provider_reply}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
