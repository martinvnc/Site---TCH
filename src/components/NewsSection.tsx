"use client";

import React, { forwardRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Signal } from 'lucide-react';

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

interface NewsSectionProps {
    isFullPage?: boolean;
}

// Simple component for news images
const NewsImage = ({ news }: { news: NewsItem }) => {
    // Priority: 1. First image from URLs array, 2. Single image_url, 3. Fallback emoji/icon
    const imageUrl = (news.image_urls && news.image_urls.length > 0)
        ? news.image_urls[0]
        : news.image_url;

    if (!imageUrl) {
        return (
            <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-5xl">
                {news.image || "🎾"}
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="w-full h-full bg-zinc-50 flex items-center justify-center text-5xl">${news.image || "🎾"}</div>`;
            }}
        />
    );
};

const NewsSection = forwardRef<HTMLElement, NewsSectionProps>(({ isFullPage = false }, ref) => {
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
                .limit(isFullPage ? 50 : 4);

            if (error) throw error;
            if (data) setNews(data);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [isFullPage]);

    if (loading) {
        return (
            <section id="actualites" className="py-20 bg-white">
                <div className="w-full px-6 sm:px-10 lg:px-24">
                    <div className="flex flex-col items-center mb-16 animate-pulse">
                        <div className="h-4 w-32 bg-zinc-100 rounded-full mb-4" />
                        <div className="h-10 w-64 bg-zinc-100 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-6 animate-pulse">
                                <div className="w-full sm:w-[40%] aspect-video sm:aspect-auto bg-zinc-100 rounded-2xl" />
                                <div className="w-full sm:w-[60%] space-y-4 py-2">
                                    <div className="h-3 w-20 bg-zinc-100 rounded-full" />
                                    <div className="h-6 w-full bg-zinc-100 rounded-lg" />
                                    <div className="h-20 w-full bg-zinc-100 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="w-full px-6 sm:px-10 lg:px-24 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6 text-red-500">
                        <Signal className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d452e] mb-2">Oups ! Impossible de charger les actualités</h3>
                    <p className="text-zinc-500 max-w-md mx-auto mb-8">
                        Il semble y avoir un souci de connexion réseau. Vérifie ta connexion ou réessaie.
                    </p>
                    <button
                        onClick={() => fetchNews()}
                        className="px-6 py-2 bg-[#2d452e] text-white rounded-xl font-bold hover:bg-[#4c7650] transition-colors"
                    >
                        Réessayer
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-8 p-4 bg-zinc-50 rounded-xl text-left text-[10px] font-mono text-zinc-400 overflow-auto max-w-xl mx-auto border border-zinc-100">
                            <p className="font-bold text-zinc-500 mb-1 tracking-widest uppercase">Debug Info:</p>
                            <p>{error.message || String(error)}</p>
                            {!process.env.NEXT_PUBLIC_SUPABASE_URL && <p className="text-red-400 mt-1">⚠️ NEXT_PUBLIC_SUPABASE_URL is missing</p>}
                        </div>
                    )}
                </div>
            </section>
        );
    }
    if (news.length === 0) return null;

    return (
        <section id="actualites" ref={ref} className={`${isFullPage ? 'pt-32 lg:pt-40 pb-24' : 'pt-12 sm:pt-16 pb-12 sm:pb-20'} bg-white relative overflow-hidden`}>
            <div className="w-full px-6 sm:px-10 lg:px-24 relative z-10">
                {isFullPage && (
                    <div className="flex flex-col items-center text-center mb-16">
                        <h1 className="text-4xl sm:text-6xl font-black text-[#2d452e] tracking-tight mb-4">
                            Toute l&apos;<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">Actualité</span>
                        </h1>
                        <div className="w-20 h-1.5 bg-[#F6CA73] rounded-full" />
                    </div>
                )}

                {/* News Grid - 2 Columns of Horizontal Cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10">
                    {news.map((item) => (
                        <div key={item.id} className="group relative flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-[#2d452e]/5 transition-all duration-500 hover:-translate-y-1">
                            {/* Card Image Area (40%) */}
                            <div className="w-full sm:w-[40%] relative aspect-[16/10] sm:aspect-auto overflow-hidden bg-zinc-50 border-r border-zinc-100">
                                <div className="w-full h-full transition-transform duration-1000 group-hover:scale-105">
                                    <NewsImage news={item} />
                                </div>

                            </div>

                            {/* Card Text Area (60%) */}
                            <div className="w-full sm:w-[60%] p-6 sm:p-8 flex flex-col">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                                    {(() => {
                                        const d = new Date(item.date);
                                        return isNaN(d.getTime()) ? item.date : d.toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        });
                                    })()}
                                </div>

                                <h3 className="text-xl sm:text-2xl font-black text-[#2d452e] mb-4 leading-tight group-hover:text-[#4c7650] transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                                    {item.description ? item.description.replace(/<[^>]*>/g, '') : ''}
                                </p>

                                <div className="mt-auto">
                                    {isFullPage && item.button_text && item.button_url ? (
                                        <a
                                            href={item.button_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#4c7650] hover:text-[#2d452e] transition-colors group/link px-3 py-1.5 bg-[#4c7650]/5 rounded-lg"
                                        >
                                            {item.button_text}
                                            <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">→</span>
                                        </a>
                                    ) : (
                                        <Link
                                            href="/actualites"
                                            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-[#4c7650] hover:text-[#2d452e] transition-colors group/link"
                                        >
                                            En savoir plus
                                            <span className="ml-2 transform group-hover/link:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {!isFullPage && (
                <div className="flex justify-center mt-8">
                    <Link
                        href="/actualites"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d452e] text-white text-sm font-bold rounded-xl hover:bg-[#4c7650] transition-colors group"
                    >
                        Voir toutes les actualités du club
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}

        </section>
    );
});

NewsSection.displayName = 'NewsSection';

export default NewsSection;
