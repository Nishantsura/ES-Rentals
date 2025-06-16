'use client'

import { Shield, MapPin, Clock, BanknoteIcon, KeyIcon, BellRingIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FeatureCard } from '@/components/ui/grid-feature-cards'

// Define the features array with all the existing content
const features = [
    {
        title: "Minimal to No Security Deposit",
        icon: Shield,
        description: "Enjoy stress-free rentals with the lowest security deposits in the market — and zero deposit on select models."
    },
    {
        title: "Delivery Anywhere in Dubai",
        icon: MapPin,
        description: "From your hotel to the helipad — we deliver your car wherever you are, right on time."
    },
    {
        title: "Speed Meets Simplicity",
        icon: Clock,
        description: "Book a car in under 60 seconds. Lightning-fast, hassle-free, and mobile-first."
    },
    {
        title: "No Hidden Fees. Ever.",
        icon: BanknoteIcon,
        description: "Transparent pricing with no surprises — what you see is what you pay."
    },
    {
        title: "Exclusive Fleet Access",
        icon: KeyIcon,
        description: "Access rare supercars, elite SUVs, and chauffeur-class vehicles that aren't listed elsewhere."
    },
    {
        title: "Premium Concierge",
        icon: BellRingIcon,
        description: "Personal concierge services available 24/7 to ensure your experience is nothing short of extraordinary."
    },
];

type ViewAnimationProps = {
    delay?: number;
    className?: React.ComponentProps<typeof motion.div>['className'];
    children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ filter: 'blur(4px)', y: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FeaturesBenefits() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto w-full max-w-5xl space-y-8 px-6">
                <AnimatedContainer className="mx-auto max-w-3xl text-center">
                    <h2 className="font-heading text-heading-2 text-zinc-800 dark:text-white">Experience the <span className="text-teal-500">Elite Selection</span></h2>
                    <p className="mt-4 text-foreground max-w-2xl mx-auto">Premium service for discerning clients who expect nothing but the best.</p>
                </AnimatedContainer>

                <AnimatedContainer
                    delay={0.4}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
                >
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} />
                    ))}
                </AnimatedContainer>
            </div>
        </section>
    )
}
