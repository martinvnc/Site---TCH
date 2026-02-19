"use client";

import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function SocialBanner() {
    return (
        <section className="bg-white relative overflow-hidden">
            <style>{`
                @keyframes banner-shimmer {
                    0% { transform: translateX(-120%) skewX(-15deg); }
                    100% { transform: translateX(220%) skewX(-15deg); }
                }
                .banner-shimmer::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255,255,255,0.06) 40%,
                        rgba(255,255,255,0.10) 50%,
                        rgba(255,255,255,0.06) 60%,
                        transparent 100%
                    );
                    animation: banner-shimmer 3.5s ease-in-out infinite;
                    pointer-events: none;
                    will-change: transform;
                }
            `}</style>


            <div className="banner-shimmer relative bg-[#2d452e] py-4 px-6 sm:px-10 lg:px-24 overflow-hidden border-y border-[#4c7650]/30 shadow-md transition-colors duration-500 hover:bg-[#344d34]">




                <div className="relative z-10 flex items-center justify-between gap-6">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest whitespace-nowrap">
                        <span className="text-[#F6CA73]">Suivez-nous</span> sur les réseaux
                    </h2>

                    <div className="flex items-center gap-3">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2 bg-white text-[#2d452e] rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
                        >
                            <Facebook className="w-4 h-4 fill-current flex-shrink-0" />
                            Facebook
                        </Link>

                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2 bg-[#F6CA73] text-[#2d452e] rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap"
                        >
                            <Instagram className="w-4 h-4 flex-shrink-0" />
                            Instagram
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
