"use client";

import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SocialBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const timer = setTimeout(() => setIsVisible(true), 1500);

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`bg-white relative overflow-hidden my-4 sm:my-6 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                }`}
        >
            <div className="relative group bg-[#2d452e] py-4 sm:py-5 px-6 sm:px-10 lg:px-24 overflow-hidden border-y border-[#4c7650]/30 shadow-2xl">
                {/* Effet Shimmer (Faisceau lumineux en mouvement) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 h-full w-[200px] bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-[25deg] animate-shimmer-beam" />
                </div>

                {/* Éléments de fond décoratifs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F6CA73]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight text-center md:text-left tracking-tight">
                            <span className="text-[#F6CA73] inline-block hover:scale-110 transition-transform duration-300 cursor-default drop-shadow-sm">Suivez-nous</span> sur les réseaux
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-3 px-8 py-3 bg-white text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105 animate-float hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        >
                            <Facebook className="w-5 h-5 fill-current group-hover/btn:rotate-12 transition-transform" />
                            <span className="text-xs uppercase tracking-widest">Facebook</span>
                        </Link>

                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-3 px-8 py-3 bg-[#F6CA73] text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105 animate-float animation-delay-2000 hover:shadow-[0_0_30px_rgba(246,202,115,0.6)]"
                        >
                            <Instagram className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            <span className="text-xs uppercase tracking-widest">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer-beam {
                    0% { left: -150%; }
                    100% { left: 250%; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-shimmer-beam {
                    animation: shimmer-beam 4s infinite ease-in-out;
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </section>
    );
}
