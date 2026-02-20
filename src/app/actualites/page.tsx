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
    const isEven = index % 2 === 0;

    return (
        <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center justify-between py-24 gap-12 md:gap-0 border-b border-zinc-50 last:border-0`}>
            {/* Image Block */}
            <div className="w-full md:w-[44%] aspect-[4/3] relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200/50 group">
                {img ? (
                    <img
                        src={img}
                        alt={item.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-[#4c7650]/5">
                        {item.image || "🎾"}
                    </div>
                )}
            </div>

            {/* Text Block */}
            <div className="w-full md:w-[48%] flex flex-col">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#4c7650] mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.date)}
                </span>

                <h2 className="text-3xl sm:text-4xl font-black text-[#2d452e] leading-tight mb-6">
                    {item.title}
                </h2>

                <div className="w-12 h-1 bg-[#F6CA73] rounded-full mb-8" />

                {item.description && (
                    <p className="text-zinc-500 font-medium leading-relaxed text-lg mb-10">
                        {cleanText(item.description)}
                    </p>
                )}

                {item.button_text && item.button_url && (
                    <a
                        href={item.button_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-7 py-4 bg-[#2d452e] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4c7650] transition-all self-start shadow-xl shadow-[#2d452e]/10 hover:-translate-y-0.5"
                    >
                        {item.button_text}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                )}
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

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Header page épuré */}
            <section className="pt-32 pb-16 px-6 sm:px-10 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4c7650]/40 hover:text-[#4c7650] transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Accueil
                    </Link>

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4c7650]/60 mb-4 ml-1">Tennis Club d'Halluin</p>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#2d452e] leading-[0.9] tracking-tighter mb-8">
                        L&apos;actu<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">du club.</span>
                    </h1>
                    <div className="w-20 h-2 bg-[#F6CA73] rounded-full" />
                </div>
            </section>

            {/* Content avec larges marges */}
            <section className="pb-40 px-6 sm:px-10 lg:px-24">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="space-y-10">
                            {[1, 2].map(i => (
                                <div key={i} className={`flex flex-col ${i % 2 !== 0 ? "md:flex-row" : "md:flex-row-reverse"} justify-between items-center py-24 animate-pulse border-b border-zinc-50`}>
                                    <div className="w-full md:w-[44%] aspect-[4/3] rounded-[2.5rem] bg-zinc-50" />
                                    <div className="w-full md:w-[48%] space-y-6">
                                        <div className="h-4 bg-zinc-50 rounded w-1/4" />
                                        <div className="h-12 bg-zinc-50 rounded w-full" />
                                        <div className="h-1 w-12 bg-zinc-50 rounded" />
                                        <div className="h-32 bg-zinc-50 rounded w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-40 text-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center">
                                <Signal className="w-10 h-10 text-red-400" />
                            </div>
                            <h3 className="text-2xl font-black text-[#2d452e]">Oups ! Connexion impossible</h3>
                            <button onClick={fetchNews} className="px-8 py-4 bg-[#2d452e] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4c7650] transition-all">
                                Réessayer
                            </button>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 text-center gap-4">
                            <span className="text-7xl text-zinc-100">🎾</span>
                            <h3 className="text-2xl font-black text-zinc-200">Aucune actualité publiée</h3>
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
