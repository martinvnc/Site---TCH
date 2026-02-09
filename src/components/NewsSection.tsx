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
};

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
        <section id="actualites" className="py-24 sm:py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#4c7650]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-[#2d452e] mb-6 tracking-tight">
                        Dernières <span className="text-[#4c7650]">actualités</span>
                    </h2>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        Restez informé de la vie du club, des événements à venir et des moments forts de notre communauté.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {news.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-[2rem] border border-[#2d452e]/5 shadow-[0_10px_40px_rgba(45,69,46,0.05)] hover:shadow-[0_20px_60px_rgba(45,69,46,0.12)] transition-all duration-500 overflow-hidden hover:-translate-y-2"
                        >
                            <div className="h-52 bg-gradient-to-br from-[#2d452e] to-[#4c7650] flex items-center justify-center text-8xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                <span className="relative z-10 drop-shadow-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-500">
                                    {item.image}
                                </span>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-[#4c7650]/10 text-[#4c7650] text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        {item.category}
                                    </span>
                                    <span className="text-zinc-400 text-xs">
                                        {item.date}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-[#2d452e] mb-4 group-hover:text-[#4c7650] transition-colors leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-600 leading-relaxed line-clamp-3 mb-6">
                                    {item.description}
                                </p>
                                <div className="w-10 h-1 bg-[#F6CA73] rounded-full scale-x-50 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default NewsSection;
