"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3, PlusCircle, ShieldCheck, Sparkles } from "lucide-react";
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

type ServiceFormValues = z.infer<typeof serviceSchema>;

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  duration: z.coerce.number().int().positive(),
});

const imageSchema = z.object({
  image_url: z.string().url(),
  caption: z.string().optional(),
  service_id: z.coerce.number().int().positive().optional(),
});

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
    <div className="flex w-full flex-col gap-10 pb-10">
      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Provider Dashboard</h1>
        </div>
        <p className="max-w-2xl text-muted-foreground">
          Manage your professional services, update your portfolio, and track your business growth.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Services", value: servicesQuery.data?.length ?? 0, icon: <PlusCircle size={18} />, color: "bg-blue-500/10 text-blue-600" },
          { 
            label: "Avg Duration", 
            value: servicesQuery.data && servicesQuery.data.length > 0
              ? Math.round(servicesQuery.data.reduce((acc, s) => acc + s.duration, 0) / servicesQuery.data.length)
              : 0, 
            unit: "min", 
            icon: <Clock3 size={18} />, 
            color: "bg-purple-500/10 text-purple-600" 
          },
          { label: "Profile Status", value: "Active", icon: <CheckCircle2 size={18} />, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Verification", value: "Verified", icon: <ShieldCheck size={18} />, color: "bg-amber-500/10 text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold flex items-baseline gap-1">
              {stat.value}
              {stat.unit && <span className="text-xs font-medium text-muted-foreground">{stat.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <Tabs defaultValue="service" className="w-full">
            <TabsList className="bg-muted p-1 rounded-xl h-auto flex w-fit mb-6">
              <TabsTrigger value="service" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                New Service
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                Add Portfolio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="mt-0 animate-in fade-in slide-in-from-top-2">
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Service Details</CardTitle>
                  <CardDescription>Fill in the details for your new professional service.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit(onCreateService)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Service Title</label>
                      <Input placeholder="e.g. Professional Haircut" className="rounded-xl h-11" {...registerService("title")} />
                      {serviceErrors.title && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{serviceErrors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Full Description</label>
                      <textarea
                        placeholder="Describe what's included and any requirements..."
                        className="min-h-32 w-full rounded-xl border border-input bg-transparent px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        {...registerService("description")}
                      />
                      {serviceErrors.description && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{serviceErrors.description.message}</p>}
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Price ($)</label>
                        <Input type="number" step="0.01" placeholder="0.00" className="rounded-xl h-11" {...registerService("price")} />
                        {serviceErrors.price && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{serviceErrors.price.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Duration (minutes)</label>
                        <Input type="number" placeholder="60" className="rounded-xl h-11" {...registerService("duration")} />
                        {serviceErrors.duration && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{serviceErrors.duration.message}</p>}
                      </div>
                    </div>

                    <Button type="submit" disabled={createServiceMutation.isPending} className="w-full rounded-full py-6 text-sm font-bold shadow-lg shadow-primary/20">
                      {createServiceMutation.isPending ? "Creating..." : "Publish Service"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0 animate-in fade-in slide-in-from-top-2">
              <Card className="rounded-2xl border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Portfolio Highlight</CardTitle>
                  <CardDescription>Add visual evidence of your work to attract more clients.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleImageSubmit(onAddImage)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Image URL</label>
                      <Input placeholder="https://example.com/image.jpg" className="rounded-xl h-11" {...registerImage("image_url")} />
                      {imageErrors.image_url && <p className="px-1 text-[10px] font-bold text-red-500 uppercase">{imageErrors.image_url.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Caption</label>
                      <Input placeholder="Describe this work sample..." className="rounded-xl h-11" {...registerImage("caption")} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">Link to Service ID (Optional)</label>
                      <Input type="number" placeholder="123" className="rounded-xl h-11" {...registerImage("service_id")} />
                    </div>

                    <Button type="submit" variant="secondary" disabled={addImageMutation.isPending} className="w-full rounded-full py-6 text-sm font-bold shadow-lg shadow-secondary/10">
                      {addImageMutation.isPending ? "Adding..." : "Add to Portfolio"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
              <Clock3 size={20} className="text-primary" />
              <h2 className="text-xl font-bold">My Active Services</h2>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {servicesQuery.data?.length ?? 0} Listed
            </p>
          </div>

          {servicesQuery.isLoading && <div className="flex justify-center p-12"><div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" /></div>}
          
          <div className="grid gap-4 sm:grid-cols-2">
            {servicesQuery.data?.map((service) => (
              <div key={service.id} className="group rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{service.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 px-3 py-2 text-right">
                    <p className="text-sm font-bold text-primary">${service.price}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{service.duration}m</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                   <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">ID: {service.id}</p>
                   <Button variant="ghost" size="xs" className="rounded-lg h-7 px-3 text-[10px] uppercase font-bold tracking-wider">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
