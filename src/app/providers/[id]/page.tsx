"use client";

import { useQuery } from "@tanstack/react-query";
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

import { MapPin, Star, Calendar, MessageCircle, ShieldCheck, ArrowLeft, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

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
    return <div className="flex min-h-[400px] items-center justify-center"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (providerQuery.isError || !providerQuery.data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <p className="text-lg font-bold text-red-500 mb-4">Professional profile not found.</p>
        <Link href="/providers"><Button variant="outline" className="rounded-xl">Back to Search</Button></Link>
      </div>
    );
  }

  const provider = providerQuery.data;

  return (
    <div className="flex w-full flex-col gap-10 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-10 lg:p-12">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        
        <Link href="/providers" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Search
        </Link>
        
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
             <div className="size-28 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary/20">
               {provider.user.username[0].toUpperCase()}
             </div>
             <div className="space-y-2">
               <div className="flex flex-wrap items-center gap-3">
                 <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{provider.user.username}</h1>
                 {provider.is_verified && <VerificationBadge />}
               </div>
               <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
                 <div className="flex items-center gap-1.5"><MapPin size={16} className="text-primary" /> {provider.location || "Available Worldwide"}</div>
                 <div className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {ratingSummaryQuery.data?.average_rating?.toFixed(1) ?? "0.0"} ({ratingSummaryQuery.data?.review_count ?? 0} Reviews)</div>
               </div>
             </div>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2">
              <MessageCircle size={18} /> Message
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 px-5 border-border/50">
               Follow
            </Button>
          </div>
        </div>
        
        <div className="mt-10 max-w-3xl">
           <p className="text-lg text-foreground/80 leading-relaxed font-medium">
             {provider.bio || "This professional is dedicated to providing high-quality service and hasn't added a full biography to their profile yet."}
           </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Grid size={20} className="text-primary" />
            <h2 className="text-2xl font-bold">Services & Pricing</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesQuery.data?.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-sm shadow-black/5"
              >
                <div className="mb-4 flex justify-between items-start">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{service.title}</h3>
                  <div className="rounded-xl bg-primary/10 px-3 py-1 font-black text-primary text-sm">${service.price}</div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-grow">{service.description}</p>
                
                <div className="space-y-4 pt-4 border-t border-border/50">
                   <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                     <span>Duration</span>
                     <span>{service.duration} Mins</span>
                   </div>
                   
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                     <input
                       type="datetime-local"
                       className="w-full rounded-xl border border-border/50 bg-background/50 pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                       value={bookingDateTime}
                       onChange={(event) => setBookingDateTime(event.target.value)}
                     />
                   </div>
                   
                   <Button 
                      className="w-full rounded-xl py-6 font-bold shadow-lg shadow-black/5"
                      onClick={async () => {
                        if (!bookingDateTime) {
                          setBookingMessage("Please select a date and time first.");
                          return;
                        }
                        try {
                          await createBooking({
                            service_id: Number(service.id),
                            scheduled_for: new Date(bookingDateTime).toISOString(),
                          });
                          setBookingMessage("Booking request sent successfully!");
                        } catch {
                          setBookingMessage("Something went wrong. Are you logged in as a client?");
                        }
                      }}
                   >
                     Book Service
                   </Button>
                </div>
              </motion.div>
            ))}
          </div>
          {bookingMessage && (
            <div className="rounded-xl bg-primary/10 p-3 text-center text-xs font-bold text-primary animate-in fade-in slide-in-from-bottom-2">
              {bookingMessage}
            </div>
          )}
        </div>

        <div className="lg:col-span-12 space-y-6 pt-10">
          <div className="flex items-center gap-2 px-1">
             <ShieldCheck size={20} className="text-primary" />
             <h2 className="text-2xl font-bold">Portfolio Gallery</h2>
          </div>
          
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {imagesQuery.data?.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-border/50"
              >
                <Image
                  src={image.image_url}
                  alt={image.caption || "Portfolio work"}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                   <p className="text-[10px] font-bold text-white uppercase tracking-wider">{image.caption || "View Work"}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12 space-y-6 pt-10">
          <div className="flex items-center gap-2 px-1">
             <Star size={20} className="text-yellow-500" />
             <h2 className="text-2xl font-bold">Client Reviews</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviewsQuery.data?.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                      {review.client.username[0].toUpperCase()}
                    </div>
                    <p className="text-sm font-bold">{review.client.username}</p>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-0.5 mb-3 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <Star key={v} size={14} fill={v <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                
                {review.comment && <p className="text-sm leading-relaxed text-foreground/80 mb-4">&ldquo;{review.comment}&rdquo;</p>}
                
                {review.image_url && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-border/10">
                    <Image src={review.image_url} alt="Review snapshot" fill className="object-cover" />
                  </div>
                )}
                
                {review.provider_reply && (
                  <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                    <p className="text-[10px] font-black uppercase text-primary mb-1 tracking-widest">Provider Response</p>
                    <p className="text-xs italic leading-snug">{review.provider_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
