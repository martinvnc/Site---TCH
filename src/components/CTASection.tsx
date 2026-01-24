"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function CTASection() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const actions = [
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
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-[#2d452e] mb-4">
                        Prêt à commencer ?
                    </h2>
                    <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                        Choisissez l'option qui vous convient le mieux
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {actions.map((action) => (
                        <Link
                            key={action.id}
                            href={action.href}
                            className="group block"
                        >
                            <div className="relative h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 hover:border-[#f6ca73] hover:-translate-y-2">
                                {/* Gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative p-8 text-center">
                                    <div className="text-6xl mb-4">{action.icon}</div>
                                    <h3 className="text-2xl font-bold text-[#2d452e] mb-3 group-hover:text-[#4c7650] transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-zinc-600">
                                        {action.description}
                                    </p>
                                    <div className="mt-6">
                                        <span className="inline-flex items-center text-[#4c7650] font-semibold group-hover:text-[#639268] transition-colors">
                                            Découvrir
                                            <svg
                                                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
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
}
