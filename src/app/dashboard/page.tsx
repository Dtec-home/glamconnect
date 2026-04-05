"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, PlusCircle, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addPortfolioImage,
  createService,
  getMyServices,
} from "@/lib/api/marketplace";

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  duration: z.coerce.number().int().positive(),
});

const imageSchema = z.object({
  image_url: z.url(),
  caption: z.string().optional(),
  service_id: z.coerce.number().int().positive().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;
type ImageFormValues = z.infer<typeof imageSchema>;

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const {
    register: registerService,
    handleSubmit: handleServiceSubmit,
    reset: resetService,
    formState: { errors: serviceErrors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
  });

  const {
    register: registerImage,
    handleSubmit: handleImageSubmit,
    reset: resetImage,
    formState: { errors: imageErrors },
  } = useForm<ImageFormValues>({
    resolver: zodResolver(imageSchema),
  });

  const servicesQuery = useQuery({
    queryKey: ["my-services"],
    queryFn: getMyServices,
  });

  const createServiceMutation = useMutation({
    mutationFn: createService,
    onSuccess: async () => {
      resetService();
      await queryClient.invalidateQueries({ queryKey: ["my-services"] });
    },
  });

  const addImageMutation = useMutation({
    mutationFn: addPortfolioImage,
    onSuccess: () => {
      resetImage();
    },
  });

  const onCreateService = (values: ServiceFormValues) => {
    createServiceMutation.mutate(values);
  };

  const onAddImage = (values: ImageFormValues) => {
    addImageMutation.mutate(values);
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <Card className="border-zinc-200/80 bg-white/95 dark:border-zinc-800 dark:bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles size={18} /> Provider Dashboard
          </CardTitle>
          <CardDescription>
            Manage your services, portfolio, and visibility from one place.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card size="sm">
          <CardContent className="pt-1">
            <p className="text-xs text-muted-foreground">Total Services</p>
            <p className="text-2xl font-semibold">{servicesQuery.data?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="pt-1">
            <p className="text-xs text-muted-foreground">Avg Duration</p>
            <p className="text-2xl font-semibold">
              {servicesQuery.data && servicesQuery.data.length > 0
                ? Math.round(
                    servicesQuery.data.reduce((acc, service) => acc + service.duration, 0) /
                      servicesQuery.data.length,
                  )
                : 0}
              <span className="ml-1 text-sm text-muted-foreground">min</span>
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="pt-1">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-medium text-emerald-600">Profile Active</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="service" className="gap-4">
        <TabsList>
          <TabsTrigger value="service">Create Service</TabsTrigger>
          <TabsTrigger value="portfolio">Add Portfolio Image</TabsTrigger>
        </TabsList>

        <TabsContent value="service">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PlusCircle size={16} /> New Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit(onCreateService)} className="space-y-4">
                <Input placeholder="Title" {...registerService("title")} />
                {serviceErrors.title ? (
                  <p className="text-xs text-red-600">{serviceErrors.title.message}</p>
                ) : null}

                <textarea
                  placeholder="Description"
                  className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  {...registerService("description")}
                />
                {serviceErrors.description ? (
                  <p className="text-xs text-red-600">
                    {serviceErrors.description.message}
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input type="number" step="0.01" placeholder="Price" {...registerService("price")} />
                  <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    {...registerService("duration")}
                  />
                </div>
                {serviceErrors.price ? (
                  <p className="text-xs text-red-600">{serviceErrors.price.message}</p>
                ) : null}
                {serviceErrors.duration ? (
                  <p className="text-xs text-red-600">{serviceErrors.duration.message}</p>
                ) : null}

                <Button type="submit" disabled={createServiceMutation.isPending}>
                  {createServiceMutation.isPending ? "Saving..." : "Create service"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Portfolio Image</CardTitle>
              <CardDescription>Paste a hosted image URL and optionally link a service.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageSubmit(onAddImage)} className="space-y-4">
                <Input placeholder="Image URL" {...registerImage("image_url")} />
                {imageErrors.image_url ? (
                  <p className="text-xs text-red-600">{imageErrors.image_url.message}</p>
                ) : null}

                <Input placeholder="Caption (optional)" {...registerImage("caption")} />
                <Input
                  type="number"
                  placeholder="Service ID (optional)"
                  {...registerImage("service_id")}
                />
                {imageErrors.service_id ? (
                  <p className="text-xs text-red-600">{imageErrors.service_id.message}</p>
                ) : null}

                <Button type="submit" disabled={addImageMutation.isPending} variant="secondary">
                  {addImageMutation.isPending ? "Saving..." : "Add image"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock3 size={16} /> My Services
          </CardTitle>
          <CardDescription>Everything currently visible on your public profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {servicesQuery.isLoading ? <p className="text-sm">Loading...</p> : null}
          {servicesQuery.isError ? (
            <p className="text-sm text-red-600">Unable to load services.</p>
          ) : null}

          <ul className="space-y-3">
            {servicesQuery.data?.map((service) => (
              <li
                key={service.id}
                className="rounded-lg border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{service.title}</p>
                    <p className="text-zinc-600 dark:text-zinc-300">{service.description}</p>
                  </div>
                  <div className="text-right text-xs text-zinc-500">
                    <p>${service.price}</p>
                    <p>{service.duration} mins</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
