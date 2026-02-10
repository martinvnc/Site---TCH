"use client";

import { memo, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type News = {
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
    image: string;
    image_url?: string;
    image_urls?: string[];
};

const NewsCarousel = memo(function NewsCarousel({ news }: { news: News }) {
    const images = news.image_urls && news.image_urls.length > 0
        ? news.image_urls
        : news.image_url ? [news.image_url] : [];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    if (images.length === 0) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-[#2d452e] to-[#4c7650] flex items-center justify-center text-6xl relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')]" />
                <span className="relative z-10 transition-transform duration-700 group-hover:scale-110">
                    {news.image}
                </span>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {images.map((url, idx) => (
                <img
                    key={url}
                    src={url}
                    alt={news.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-105 translate-x-4 pointer-events-none"
                        }`}
                />
            ))}

            {/* Pagination Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? "bg-white w-4" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

const NewsSection = memo(function NewsSection() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from("homepage_news")
                .select("*")
                .eq("is_visible", true)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setNews(data);
            }
            setLoading(false);
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="h-10 w-64 bg-gray-100 rounded-full animate-pulse mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[400px] bg-gray-50 rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (news.length === 0) return null;

    return (
        <section id="actualites" className="pt-8 pb-10 sm:pt-12 sm:pb-16 bg-white relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 flex flex-col items-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#2d452e] mb-2 tracking-tight">
                        Derniers <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">événements</span>
                    </h2>
                    <div className="w-12 h-1 bg-[#F6CA73] rounded-full mb-4" />
                    <p className="text-xs sm:text-sm text-gray-500 font-medium tracking-wide">Toute l'actualité et la vie de notre club.</p>
                </div>

                <div className="space-y-16 sm:space-y-20">
                    {news.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 sm:gap-14 md:gap-16 items-center`}
                        >
                            {/* Image Block - Independent - Reduced Size */}
                            <div className="w-full md:w-[40%] group relative">
                                <div className="aspect-square overflow-hidden rounded-2xl bg-[#2d452e]/5 shadow-[0_15px_40px_rgba(45,69,46,0.08)] transition-transform duration-700 group-hover:scale-[1.02]">
                                    <NewsCarousel news={item} />
                                    <div className="absolute inset-0 border border-[#2d452e]/10 rounded-2xl pointer-events-none z-10" />
                                </div>
                                {/* Decorative badge behind */}
                                <div className={`absolute -bottom-3 ${index % 2 === 0 ? '-right-3' : '-left-3'} w-20 h-20 bg-[#f6ca73]/10 rounded-full blur-2xl -z-10`} />
                            </div>

                            {/* Text Block - Independent - Adjusted width */}
                            <div className="w-full md:w-[60%] flex flex-col items-start px-2">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#F6CA73]">
                                        {item.category}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                                        {(() => {
                                            const d = new Date(item.date);
                                            if (isNaN(d.getTime())) return item.date;
                                            return d.toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }).replace('.', '');
                                        })()}
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#2d452e] mb-4 leading-[1.1] tracking-normal">
                                    {item.title}
                                </h3>

                                <div
                                    className="text-zinc-500 text-base leading-relaxed mb-6 max-w-lg news-description"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                />

                                <button className="group relative flex items-center gap-4 py-2">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d452e] group-hover:text-[#4c7650] transition-colors">
                                        Lire la suite
                                    </span>
                                    <div className="flex items-center">
                                        <div className="w-6 h-[2px] bg-[#f6ca73] transition-all duration-300 group-hover:w-10" />
                                        <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#f6ca73] rotate-45 -ml-1" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
});

export default NewsSection;
