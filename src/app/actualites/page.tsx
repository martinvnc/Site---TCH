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

function NewsRow({ item, index }: { item: NewsItem; index: number }) {
    const img = getImageUrl(item);
    const isEven = index % 2 === 0; // pair → photo gauche, impair → photo droite

    const imageBlock = (
        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto relative overflow-hidden rounded-[1.5rem] bg-zinc-100 shrink-0">
            {img ? (
                <img
                    src={img}
                    alt={item.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl bg-[#4c7650]/5">
                    {item.image || "🎾"}
                </div>
            )}
        </div>
    );

    const textBlock = (
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4c7650] mb-3 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(item.date)}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2d452e] leading-tight mb-4">
                {item.title}
            </h2>
            <div className="w-10 h-1 bg-[#F6CA73] rounded-full mb-5" />
            {item.description && (
                <p className="text-zinc-500 font-medium leading-relaxed text-base mb-6">
                    {cleanText(item.description)}
                </p>
            )}
            {item.button_text && item.button_url && (
                <a
                    href={item.button_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d452e] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#4c7650] transition-colors self-start"
                >
                    {item.button_text}
                    <ArrowRight className="w-3.5 h-3.5" />
                </a>
            )}
        </div>
    );

    return (
        <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-center py-16 border-b border-zinc-100 last:border-0`}>
            {imageBlock}
            {textBlock}
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

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Header page */}
            <section className="pt-24 sm:pt-28 pb-4 px-6 sm:px-10 lg:px-24">
                <div className="max-w-5xl mx-auto">
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">actualités</span>
                    </h1>
                    <div className="w-14 h-1.5 bg-[#F6CA73] rounded-full" />
                </div>
            </section>

            {/* Content */}
            <section className="pb-28 px-6 sm:px-10 lg:px-24">
                <div className="max-w-5xl mx-auto">
                    {loading ? (
                        <div className="space-y-14 pt-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`flex ${i % 2 !== 0 ? "flex-row" : "flex-row-reverse"} gap-12 items-center py-14 border-b border-zinc-100 animate-pulse`}>
                                    <div className="w-1/2 aspect-[4/3] rounded-[1.5rem] bg-zinc-100" />
                                    <div className="w-1/2 space-y-4">
                                        <div className="h-3 w-24 bg-zinc-100 rounded" />
                                        <div className="h-8 w-3/4 bg-zinc-100 rounded" />
                                        <div className="h-1 w-10 bg-zinc-100 rounded" />
                                        <div className="h-24 bg-zinc-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                                <Signal className="w-7 h-7 text-red-400" />
                            </div>
                            <h3 className="text-xl font-black text-[#2d452e]">Impossible de charger les actualités</h3>
                            <button onClick={fetchNews} className="px-6 py-2.5 bg-[#2d452e] text-white rounded-xl font-bold text-sm hover:bg-[#4c7650] transition-colors">
                                Réessayer
                            </button>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                            <span className="text-5xl">🎾</span>
                            <h3 className="text-xl font-black text-[#2d452e]">Aucune actualité pour le moment</h3>
                        </div>
                    ) : (
                        <div>
                            {news.map((item, index) => (
                                <NewsRow key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
