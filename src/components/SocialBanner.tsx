"use client";

import { Facebook, Instagram, Share2 } from "lucide-react";
import Link from "next/link";

export default function SocialBanner() {
    return (
        <section className="bg-white relative overflow-hidden my-6 sm:my-10">
            <div className="relative group bg-[#2d452e] py-3 sm:py-4 px-6 sm:px-10 lg:px-24 overflow-hidden border-y border-[#4c7650]/20">
                {/* Animated Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                        <h2 className="text-lg sm:text-xl font-black text-white leading-tight text-center md:text-left tracking-tight">
                            <span className="text-[#F6CA73]">Suivez-nous</span> sur les réseaux
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-2.5 px-6 py-2 bg-white text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-[1.03]"
                        >
                            <Facebook className="w-4 h-4 fill-current" />
                            <span className="text-[10px] uppercase tracking-widest">Facebook</span>
                        </Link>

                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-2.5 px-6 py-2 bg-[#F6CA73] text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-[1.03]"
                        >
                            <Instagram className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-widest">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
