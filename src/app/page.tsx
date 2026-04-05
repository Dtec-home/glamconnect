"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";

const highlights = [
  {
    title: "Global Excellence",
    description: "Connect with elite professionals manually vetted for world-class quality and reliability.",
    icon: ShieldCheck,
    color: "text-accent",
  },
  {
    title: "Instant Connection",
    description: "Discover talent and book premium services in under 60 seconds. Efficiency redefined.",
    icon: Sparkles,
    color: "text-primary",
  },
  {
    title: "Elite Community",
    description: "Join thousands of clients who trust GlamKonnect for their most ambitious projects.",
    icon: Users,
    color: "text-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 } as const,
  },
};

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/30 backdrop-blur-sm -mt-6">
        <div className="absolute inset-0 -z-10 h-full w-full">
           <Image 
             src="/branding/hero.png" 
             alt="Diverse Professional Services" 
             fill 
             className="object-cover opacity-40 mix-blend-overlay"
             sizes="100vw"
             priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" />
        </div>
        
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center pt-24 pb-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary"
          >
            <Star size={14} className="fill-primary" />
            <span>Excellence in every connection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl text-5xl font-black tracking-tight sm:text-8xl lg:leading-[1.1]"
          >
            Connect with <span className="text-primary italic">World-Class</span> experts for every ambition.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg text-muted-foreground/80 sm:text-xl font-medium leading-relaxed"
          >
            GlamKonnect is the premier destination for elite professionals in Wellness, Tech, Creative Arts, and Style. 
            Experience a new standard of professional collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap justify-center gap-6"
          >
            <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-bold shadow-2xl shadow-primary/40">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2" size={20} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-10 text-base font-bold backdrop-blur-md">
              <Link href="/providers">Explore Network</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-3"
      >
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="group h-full border-none bg-card/40 backdrop-blur-sm transition-all hover:bg-card/60 hover:-translate-y-2">
                <CardHeader>
                  <div className={`mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-background shadow-xl ring-1 ring-border/50 group-hover:scale-110 transition-transform ${item.color}`}>
                    <Icon size={28} />
                  </div>
                  <CardTitle className="text-2xl font-black tracking-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground/90 font-medium leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[3rem] border border-border/50 bg-card p-8 sm:p-20 overflow-hidden shadow-2xl shadow-black/10"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Sparkles size={200} className="text-primary" />
        </div>
        
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black sm:text-6xl lg:leading-tight">Elevate your professional <span className="text-primary">standard</span>.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you&apos;re looking for world-class talent or offering your expertise, 
              GlamKonnect provides the infrastructure you need to thrive in a global economy.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Vetted Global Expert Network",
                "Intuitive Dashboard & Analytics",
                "Advanced Booking Management",
                "Premium Client Support",
              ].map((text) => (
                <li key={text} className="flex items-center gap-4 font-bold tracking-tight">
                  <CheckCircle2 className="text-primary" size={24} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
             <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-30 -z-10" />
             <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/50 shadow-2xl">
                <Image 
                  src="/branding/mockup.png" 
                  alt="GlamKonnect App Interface" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  priority
                />
             </div>
             
             <div className="mt-8 grid gap-4 grid-cols-2">
                <Button asChild size="lg" className="rounded-2xl h-14 font-black">
                   <Link href="/register">Join Experts</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 font-black backdrop-blur-md">
                   <Link href="/providers">Hire Talent</Link>
                </Button>
             </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
