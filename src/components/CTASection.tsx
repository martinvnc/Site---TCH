"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, memo } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const CTASection = memo(function CTASection() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error("Session error in CTASection:", error);
                setUser(null);
            } else {
                setUser(session?.user ?? null);
            }
        }).catch((err) => {
            console.error("Unexpected session retrieval error in CTASection:", err);
            setUser(null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const actions = useMemo(() => [
        {
            id: 1,
            title: "Réservation",
            description: "Réservez votre court en ligne",
            icon: "📅",
            href: user ? "/reservation" : "/login",
            color: "from-[#4c7650] to-[#639268]",
        },
        {
            id: 2,
            title: "Entraînement",
            description: "Découvrez nos cours et stages",
            icon: "🎾",
            href: "/entrainement",
            color: "from-[#639268] to-[#4c7650]",
        },
        {
            id: 3,
            title: "En savoir plus",
            description: "Découvrez notre club",
            icon: "ℹ️",
            href: "/about",
            color: "from-[#2d452e] to-[#4c7650]",
        },
    ], [user]);

    return (
        <section className="py-8 sm:py-12 bg-white min-h-[auto]">
            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d452e] mb-3 sm:mb-4">
                        Prêt à commencer ?
                    </h2>
                    <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto px-4">
                        Choisissez l'option qui vous convient le mieux
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                    {actions.map((action) => (
                        <Link
                            key={action.id}
                            href={action.href}
                            className="group block"
                        >
                            <div className="relative h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 hover:border-[#f6ca73] hover:-translate-y-2">
                                {/* Gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative p-6 sm:p-8 text-center">
                                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{action.icon}</div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#2d452e] mb-2 sm:mb-3 group-hover:text-[#4c7650] transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-zinc-600">
                                        {action.description}
                                    </p>
                                    <div className="mt-4 sm:mt-6">
                                        <span className="inline-flex items-center text-sm sm:text-base text-[#4c7650] font-semibold group-hover:text-[#639268] transition-colors">
                                            Découvrir
                                            <svg
                                                className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default CTASection;
