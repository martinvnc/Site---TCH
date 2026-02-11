"use client";

import { memo, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Calendar, Users, Star, Loader2, ChevronLeft, ChevronRight, Target, Shield } from "lucide-react";

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

const iconMap: Record<string, any> = {
    Trophy,
    Star,
    Users,
};

const ResultsSection = memo(function ResultsSection() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    // Responsive items per view
    const [itemsPerView, setItemsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerView(1);
            else if (window.innerWidth < 1024) setItemsPerView(2);
            else setItemsPerView(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            const { data, error } = await supabase
                .from("homepage_results")
                .select("*")
                .eq("is_visible", true)
                .order("date", { ascending: false })
                .order("created_at", { ascending: false });

            if (!error && data) {
                setResults(data);
            }
            setLoading(false);
        };

        fetchResults();
    }, []);

    // Auto-play logic with "U-turn" (direction change)
    useEffect(() => {
        if (results.length <= itemsPerView || isPaused) return;

        const maxIndex = results.length - itemsPerView;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                let next = prev + direction;

                if (next > maxIndex) {
                    setDirection(-1);
                    return prev - 1;
                }
                if (next < 0) {
                    setDirection(1);
                    return prev + 1;
                }
                return next;
            });
        }, 5000);

        return () => clearInterval(timer);
    }, [results.length, itemsPerView, isPaused, direction]);

    const nextSlide = () => {
        const maxIndex = results.length - itemsPerView;
        if (currentIndex >= maxIndex) {
            setCurrentIndex(0);
            setDirection(1);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex <= 0) {
            const maxIndex = results.length - itemsPerView;
            setCurrentIndex(maxIndex);
            setDirection(-1);
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (results.length === 0) return null;

    const showControls = results.length > itemsPerView;

    return (
        <section className="py-10 sm:py-16 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 flex flex-col items-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#2d452e] mb-2 tracking-tight">
                        Derniers <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">résultats</span>
                    </h2>
                    <div className="w-12 h-1 bg-[#F6CA73] rounded-full mb-4" />
                    <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">Découvrez les performances récentes de nos équipes et joueurs.</p>
                </div>

                <div
                    className="relative group/carousel"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation Arrows - Left for Left, Right for Right */}
                    {showControls && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white shadow-xl items-center justify-center text-[#2d452e] hover:bg-[#4c7650] hover:text-white transition-all z-20 group active:bg-[#3a5a3d]"
                                title="Précédent"
                            >
                                <ChevronLeft className="w-6 h-6 stroke-[3px] transform group-active:scale-90 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gray-100 bg-white shadow-xl items-center justify-center text-[#2d452e] hover:bg-[#4c7650] hover:text-white transition-all z-20 group active:bg-[#3a5a3d]"
                                title="Suivant"
                            >
                                <ChevronRight className="w-6 h-6 stroke-[3px] transform group-active:scale-90 transition-transform" />
                            </button>
                        </>
                    )}
                    <div className="overflow-visible sm:overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div
                            className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) gap-6"
                            style={{
                                transform: `translateX(calc(-${currentIndex} * (100% + 24px) / ${itemsPerView}))`
                            }}
                        >
                            {results.map((res) => {
                                const isAmical = res.type === "Match amical" || res.type === "Tournoi" || res.type === "Interclub";
                                const isTournoi = res.type === "Tournoi";
                                const isInterclub = res.type === "Interclub";
                                const players = (res.players || "").split(" | ");
                                const rawScores = (res.score || "").split(" ");
                                let scores = rawScores;

                                if (isAmical && rawScores.length === 3) {
                                    const s1 = rawScores[0].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                    const s2 = rawScores[1].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                    const p1Sets = (s1[0] > s1[1] ? 1 : 0) + (s2[0] > s2[1] ? 1 : 0);
                                    const p2Sets = (s1[1] > s1[0] ? 1 : 0) + (s2[1] > s2[0] ? 1 : 0);
                                    if (p1Sets === 2 || p2Sets === 2) {
                                        scores = [rawScores[0], rawScores[1]];
                                    }
                                }
                                const status = res.status || "";
                                const isVictory = status.toLowerCase().includes("victoire") || status.toLowerCase().includes("vainqueur");

                                return (
                                    <div
                                        key={res.id}
                                        className="flex-shrink-0 transition-all duration-500"
                                        style={{ width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})` }}
                                    >
                                        <div className="group h-full bg-white rounded-[2.5rem] border border-[#2d452e]/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(45,69,46,0.08)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col overflow-hidden">
                                            {/* Photo Banner or Icon Fallback */}
                                            <div className="relative aspect-[5/4] overflow-hidden bg-white flex items-center justify-center group-hover:bg-zinc-50 transition-colors duration-500">
                                                {res.image_url ? (
                                                    <>
                                                        <img src={res.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-3 text-[#4c7650]/20 transition-transform duration-500 group-hover:scale-110 group-hover:text-[#4c7650]/40">
                                                        {res.type === "Tournoi" ? (
                                                            <Trophy className="w-20 h-20 stroke-[1.2px]" />
                                                        ) : res.type === "Interclub" ? (
                                                            <Target className="w-20 h-20 stroke-[1.2px]" />
                                                        ) : (
                                                            <Users className="w-20 h-20 stroke-[1.2px]" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="px-2.5 py-1 bg-[#4c7650]/10 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#4c7650]">
                                                        {isTournoi || isInterclub ? res.status : res.type}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-gray-600 text-[10px] sm:text-xs font-bold">
                                                        <Calendar className="w-3.5 h-3.5 text-[#4c7650]" />
                                                        {(res.date || "").includes("-")
                                                            ? new Date(res.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                                                            : res.date}
                                                    </div>
                                                </div>

                                                <div className="flex-grow space-y-1.5 mb-4">

                                                    {isAmical ? (
                                                        players.map((p, pIdx) => {
                                                            // For Tournoi, we need to calculate winner from score if status is tournament name
                                                            // But user said "trophée sur le gagnant".
                                                            // Since we store scores, p1 is our player, p2 is "Adversaire".
                                                            const p1Score = rawScores.map(s => s.split("/")[0]);
                                                            const p2Score = rawScores.map(s => s.split("/")[1]);
                                                            // Simplified high level win check
                                                            const s1 = rawScores[0]?.split("/");
                                                            const s2 = rawScores[1]?.split("/");
                                                            const s3Raw = rawScores[2];

                                                            let p1Wins = 0;
                                                            let p2Wins = 0;
                                                            if (s1 && s1.length >= 2) {
                                                                const p1 = s1[0].split("(")[0];
                                                                const p2 = s1[1].split("(")[0];
                                                                if (parseInt(p1) > parseInt(p2)) p1Wins++; else p2Wins++;
                                                            }
                                                            if (s2 && s2.length >= 2) {
                                                                const p1 = s2[0].split("(")[0];
                                                                const p2 = s2[1].split("(")[0];
                                                                if (parseInt(p1) > parseInt(p2)) p1Wins++; else p2Wins++;
                                                            }

                                                            // Handle decider (Set 3 or STB) for Tennis matches
                                                            if (!isInterclub && s3Raw && p1Wins === 1 && p2Wins === 1) {
                                                                if (s3Raw.includes("-")) {
                                                                    const stb = s3Raw.split("-");
                                                                    if (stb.length >= 2) {
                                                                        if (parseInt(stb[0]) > parseInt(stb[1])) p1Wins++; else p2Wins++;
                                                                    }
                                                                } else if (s3Raw.includes("/")) {
                                                                    const s3 = s3Raw.split("/");
                                                                    if (s3.length >= 2) {
                                                                        const p1 = s3[0].split("(")[0];
                                                                        const p2 = s3[1].split("(")[0];
                                                                        if (parseInt(p1) > parseInt(p2)) p1Wins++; else p2Wins++;
                                                                    }
                                                                }
                                                            }

                                                            // For Interclub, simple score compare
                                                            if (isInterclub && rawScores[0]) {
                                                                const global = rawScores[0].split("-");
                                                                p1Wins = parseInt(global[0]) || 0;
                                                                p2Wins = parseInt(global[1]) || 0;
                                                            }

                                                            const hasWon = pIdx === 0 ? p1Wins > p2Wins : p2Wins > p1Wins;

                                                            return (
                                                                <div key={pIdx} className="flex items-center justify-between py-1.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-base sm:text-lg font-medium tracking-tight ${hasWon ? "text-[#2d452e]" : "text-gray-500"}`}>
                                                                            {p}
                                                                        </span>
                                                                    </div>
                                                                    {hasWon && (
                                                                        <div className="relative">
                                                                            <Trophy className="w-4.5 h-4.5 text-yellow-500 fill-current drop-shadow-sm relative z-10" />
                                                                            <div className="absolute inset-0 bg-yellow-400 blur-md opacity-20" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="bg-[#4c7650]/5 p-3.5 rounded-xl border border-[#4c7650]/10 hover:border-[#4c7650]/20 transition-colors">
                                                            <h3 className="text-lg sm:text-xl font-medium text-[#2d452e] leading-tight mb-1.5 uppercase tracking-tight">{res.players}</h3>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isVictory ? "text-green-600" : "text-red-600"}`}>
                                                                {res.status}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                                    {scores.map((s, sIdx) => {
                                                        const isSTB = s.includes("-");
                                                        const hasTBPoints = s.includes("(");
                                                        let tbPoints = "";
                                                        let cleanScore = s;

                                                        if (hasTBPoints) {
                                                            const parts = s.split("(");
                                                            cleanScore = parts[0];
                                                            tbPoints = parts[1].replace(")", "");
                                                        }

                                                        const [p1, p2] = isSTB ? (cleanScore.split("-") || ["0", "0"]) : (cleanScore.split("/") || ["0", "0"]);

                                                        return (
                                                            <div key={sIdx} className={`relative bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2.5 min-w-[70px] justify-center transition-transform hover:scale-105 ${isSTB ? "bg-yellow-50/20 border-yellow-100" : ""}`}>
                                                                <div className="flex items-center gap-0.5">
                                                                    <span className={`font-black text-xs sm:text-xl ${parseInt(p1 || "0") > parseInt(p2 || "0") ? "text-[#4c7650]" : "text-gray-600"}`}>{p1 || "0"}</span>
                                                                    {hasTBPoints && parseInt(p1 || "0") < parseInt(p2 || "0") && <span className="text-[10px] font-bold text-gray-400 self-start mt-0.5">{tbPoints}</span>}
                                                                </div>

                                                                <div className="w-px h-5 bg-gray-200" />

                                                                <div className="flex items-center gap-0.5">
                                                                    <span className={`font-black text-xs sm:text-xl ${parseInt(p2 || "0") > parseInt(p1 || "0") ? "text-[#4c7650]" : "text-gray-600"}`}>{p2 || "0"}</span>
                                                                    {hasTBPoints && parseInt(p2 || "0") < parseInt(p1 || "0") && <span className="text-[10px] font-bold text-gray-400 self-start mt-0.5">{tbPoints}</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Indicators */}
                    {showControls && (
                        <div className="flex justify-center gap-2 mt-8 md:hidden">
                            {Array.from({ length: results.length - itemsPerView + 1 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? "bg-[#4c7650] w-6" : "bg-gray-200"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
});

export default ResultsSection;
