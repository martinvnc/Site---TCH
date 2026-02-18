"use client";

import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function SocialBanner() {
    return (
        <section className="bg-white relative overflow-hidden my-4 sm:my-6">
            <div className="relative group bg-[#2d452e] py-6 sm:py-8 px-6 sm:px-10 lg:px-24 overflow-hidden border-y border-[#4c7650]/30 shadow-lg transition-colors duration-500 hover:bg-[#344d34]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight uppercase">
                            <span className="text-[#F6CA73]">Suivez-nous</span> sur les réseaux
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-3 bg-white text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105"
                        >
                            <Facebook className="w-5 h-5 fill-current" />
                            <span className="text-xs uppercase tracking-widest text-nowrap">Facebook</span>
                        </Link>

                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-8 py-3 bg-[#F6CA73] text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105"
                        >
                            <Instagram className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-widest text-nowrap">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
