"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Calendar, Target, Users, ChevronLeft, ChevronRight } from "lucide-react";

type Result = {
    id: string;
    players: string;
    type: string;
    score: string;
    status: string;
    date: string;
    icon: string;
    image_url?: string;
};

const ITEMS_PER_PAGE = 4;
const GAP = 12; // px gap between cards

function ResultCard({ res }: { res: Result }) {
    const isVictory = (res.status || "").toLowerCase().includes("victoire") || (res.status || "").toLowerCase().includes("vainqueur");
    const players = (res.players || "").split(" | ");
    const scores = (res.score || "").split(" ");

    return (
        <div className="bg-white rounded-xl border border-[#2d452e]/10 shadow-sm overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            {/* Image or icon */}
            <div className="relative aspect-video bg-zinc-50 overflow-hidden flex items-center justify-center">
                {res.image_url ? (
                    <img
                        src={res.image_url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[center_25%]"
                    />
                ) : (
                    <div className="text-[#4c7650]/20">
                        {res.type === "Tournoi" ? (
                            <Trophy className="w-8 h-8 stroke-[1.2px]" />
                        ) : res.type === "Interclub" ? (
                            <Target className="w-8 h-8 stroke-[1.2px]" />
                        ) : (
                            <Users className="w-8 h-8 stroke-[1.2px]" />
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-[#4c7650]/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#4c7650]">
                        {res.type}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold">
                        <Calendar className="w-2.5 h-2.5 text-[#4c7650]/50" />
                        {(res.date || "").includes("-")
                            ? new Date(res.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
                            : res.date}
                    </div>
                </div>

                <div className="space-y-1 mb-2">
                    {players.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#2d452e] truncate max-w-[80%]">
                                {p.length > 20 ? p.substring(0, 18) + "…" : p}
                            </span>
                            {i === 0 && isVictory && (
                                <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-1.5 flex-wrap border-t border-gray-100 pt-2">
                    {scores.map((s, i) => {
                        const parts = s.includes("/") ? s.split("/") : s.includes("-") ? s.split("-") : [s];
                        return (
                            <div key={i} className="bg-zinc-50 border border-gray-100 rounded-lg px-1.5 py-0.5 flex items-center gap-1 text-xs font-black">
                                <span className="text-[#4c7650]">{parts[0]?.split("(")[0]}</span>
                                {parts[1] && <><span className="text-gray-300">/</span><span className="text-gray-500">{parts[1]?.split("(")[0]}</span></>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function ResultsSection() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await supabase
                    .from("homepage_results")
                    .select("id, players, type, score, status, date, icon, image_url")
                    .eq("is_visible", true)
                    .order("date", { ascending: false })
                    .order("created_at", { ascending: false });
                if (data) setResults(data);
            } catch {
                // fail silently
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <section className="py-8 bg-white">
                <div className="w-full px-6 sm:px-10 lg:px-24">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-video bg-zinc-50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (results.length === 0) return null;

    const maxIndex = Math.max(0, results.length - ITEMS_PER_PAGE);

    return (
        <section className="py-8 sm:py-10 bg-white">
            <div className="w-full px-6 sm:px-10 lg:px-24">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#2d452e] mb-1.5">
                        Derniers <span className="text-[#4c7650]">résultats</span>
                    </h2>
                    <div className="w-10 h-1 bg-[#F6CA73] rounded-full mx-auto mb-2" />
                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
                        Performances récentes de nos équipes et joueurs.
                    </p>
                </div>

                {/* Carousel wrapper */}
                <div className="relative">
                    {/* Prev arrow */}
                    {index > 0 && (
                        <button
                            onClick={() => setIndex(i => Math.max(0, i - 1))}
                            className="hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white shadow-xl items-center justify-center text-[#2d452e] hover:bg-[#4c7650] hover:text-white transition-all z-20"
                        >
                            <ChevronLeft className="w-6 h-6 stroke-[3px]" />
                        </button>
                    )}
                    {/* Next arrow */}
                    {index < maxIndex && (
                        <button
                            onClick={() => setIndex(i => Math.min(maxIndex, i + 1))}
                            className="hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white shadow-xl items-center justify-center text-[#2d452e] hover:bg-[#4c7650] hover:text-white transition-all z-20"
                        >
                            <ChevronRight className="w-6 h-6 stroke-[3px]" />
                        </button>
                    )}

                    {/* Desktop: animated translateX carousel */}
                    <div className="hidden sm:block overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                gap: `${GAP}px`,
                                transform: `translateX(calc(-${index} * (100% + ${GAP}px) / ${ITEMS_PER_PAGE}))`,
                            }}
                        >
                            {results.map((res) => (
                                <div
                                    key={res.id}
                                    style={{ width: `calc((100% - ${(ITEMS_PER_PAGE - 1) * GAP}px) / ${ITEMS_PER_PAGE})` }}
                                    className="flex-shrink-0"
                                >
                                    <ResultCard res={res} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile: native CSS scroll */}
                    <div className="flex sm:hidden gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                        {results.map((res) => (
                            <div key={res.id} className="flex-shrink-0 w-[72vw] snap-start">
                                <ResultCard res={res} />
                            </div>
                        ))}
                    </div>

                    {/* Desktop dots */}
                    {results.length > ITEMS_PER_PAGE && (
                        <div className="hidden sm:flex justify-center gap-2 mt-4">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "bg-[#4c7650] w-6" : "bg-gray-200 w-2"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
