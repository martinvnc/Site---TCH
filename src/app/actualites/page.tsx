"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Signal } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    image?: string;
    image_url?: string;
    image_urls?: string[];
    button_text?: string;
    button_url?: string;
}

function cleanText(html: string) {
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function getImageUrl(item: NewsItem): string | null {
    if (item.image_urls && item.image_urls.length > 0) return item.image_urls[0];
    if (item.image_url) return item.image_url;
    return null;
}

/* ── Hero Card (première actu) ── */
function HeroNewsCard({ item }: { item: NewsItem }) {
    const img = getImageUrl(item);
    return (
        <div className="group relative rounded-[2rem] overflow-hidden bg-[#2d452e] min-h-[420px] sm:min-h-[520px] flex flex-col justify-end cursor-default">
            {img && (
                <img
                    src={img}
                    alt={item.title}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700 scale-100 group-hover:scale-105 transition-transform duration-1000"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2d452e] via-[#2d452e]/60 to-transparent" />
            <div className="relative z-10 p-8 sm:p-12">
                <p className="text-[#F6CA73] text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-2xl">
                    {item.title}
                </h2>
                {item.description && (
                    <p className="text-white/70 font-medium leading-relaxed max-w-xl mb-6 line-clamp-2 hidden sm:block">
                        {cleanText(item.description)}
                    </p>
                )}
                {item.button_text && item.button_url && (
                    <a
                        href={item.button_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F6CA73] text-[#2d452e] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors"
                    >
                        {item.button_text}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
        </div>
    );
}

/* ── Regular Card ── */
function NewsCard({ item }: { item: NewsItem }) {
    const img = getImageUrl(item);
    return (
        <div className="group flex flex-col sm:flex-row bg-white rounded-[1.5rem] border border-zinc-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#2d452e]/5 hover:-translate-y-1 transition-all duration-500">
            {/* Image */}
            <div className="w-full sm:w-[42%] relative aspect-video sm:aspect-auto bg-zinc-50 overflow-hidden shrink-0">
                {img ? (
                    <img
                        src={img}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-[#4c7650]/5">
                        {item.image || "🎾"}
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="flex flex-col p-6 sm:p-7 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.date)}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-[#2d452e] leading-tight mb-3 group-hover:text-[#4c7650] transition-colors duration-300">
                    {item.title}
                </h3>
                {item.description && (
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 font-medium mb-5">
                        {cleanText(item.description)}
                    </p>
                )}
                <div className="mt-auto">
                    {item.button_text && item.button_url ? (
                        <a
                            href={item.button_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4c7650]/10 text-[#4c7650] text-xs font-black uppercase tracking-widest hover:bg-[#4c7650] hover:text-white transition-all"
                        >
                            {item.button_text}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-50 text-zinc-400 text-xs font-black uppercase tracking-widest">
                            Actualité du club
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Skeleton ── */
function Skeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="rounded-[2rem] bg-zinc-100 h-[420px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 rounded-[1.5rem] border border-zinc-100 overflow-hidden p-0">
                        <div className="w-[42%] bg-zinc-100 aspect-video" />
                        <div className="flex-1 p-6 space-y-3">
                            <div className="h-3 bg-zinc-100 rounded w-24" />
                            <div className="h-5 bg-zinc-100 rounded w-full" />
                            <div className="h-16 bg-zinc-100 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ActualitesPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("homepage_news")
                .select("*")
                .eq("is_visible", true)
                .order("date", { ascending: false })
                .limit(50);
            if (error) throw error;
            if (data) setNews(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const [hero, ...rest] = news;

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* ── Hero section ── */}
            <section className="pt-24 sm:pt-28 pb-6 px-6 sm:px-10 lg:px-24 bg-white">
                <div className="w-full">
                    {/* Breadcrumb */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#4c7650] transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        Retour à l'accueil
                    </Link>

                    <p className="text-xs font-black uppercase tracking-widest text-[#4c7650] mb-3">Tennis Club d'Halluin</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#2d452e] leading-tight mb-3">
                        Toutes les{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">
                            actualités
                        </span>
                    </h1>
                    <div className="w-14 h-1.5 bg-[#F6CA73] rounded-full mb-2" />
                </div>
            </section>

            {/* ── Content ── */}
            <section className="pb-28 px-6 sm:px-10 lg:px-24">
                <div className="w-full">
                    {loading ? (
                        <Skeleton />
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                                <Signal className="w-7 h-7 text-red-400" />
                            </div>
                            <h3 className="text-xl font-black text-[#2d452e]">Impossible de charger les actualités</h3>
                            <p className="text-zinc-400 font-medium max-w-xs">Vérifie ta connexion ou réessaie.</p>
                            <button
                                onClick={fetchNews}
                                className="px-6 py-2.5 bg-[#2d452e] text-white rounded-xl font-bold text-sm hover:bg-[#4c7650] transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                            <span className="text-5xl">🎾</span>
                            <h3 className="text-xl font-black text-[#2d452e]">Aucune actualité pour le moment</h3>
                            <p className="text-zinc-400 font-medium">Revenez bientôt !</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* La 1ère actu en grand hero card */}
                            {hero && <HeroNewsCard item={hero} />}

                            {/* Compteur */}
                            {rest.length > 0 && (
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="h-px flex-1 bg-zinc-100" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        {rest.length} autre{rest.length > 1 ? "s" : ""} actualité{rest.length > 1 ? "s" : ""}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-100" />
                                </div>
                            )}

                            {/* Grille des autres actus */}
                            {rest.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {rest.map(item => (
                                        <NewsCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
