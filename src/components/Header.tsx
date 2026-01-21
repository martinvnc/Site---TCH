"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(76,118,80,0.12)] border-b border-[#4c7650]/10"
                : "bg-white/80 backdrop-blur-2xl border-b border-transparent"
                }`}
            style={{
                backgroundImage: scrolled
                    ? 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98))'
                    : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.9))'
            }}
        >
            {/* Subtle gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f6ca73]/60 to-transparent opacity-70" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-3 items-center transition-all duration-500 ${scrolled ? "h-[72px]" : "h-20"
                    }`}>
                    {/* Menu navigation à gauche */}
                    <nav className="flex items-center gap-8">
                        <Link
                            href="/club"
                            className="relative text-sm font-semibold text-[#4c7650] transition-all duration-300 hover:text-[#2d452e] group"
                        >
                            <span className="relative z-10">Le Club</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f6ca73] to-[#4c7650] transition-all duration-300 group-hover:w-full" />
                            <span className="absolute inset-0 -z-10 bg-[#f6ca73]/0 rounded-lg transition-all duration-300 group-hover:bg-[#f6ca73]/10 scale-0 group-hover:scale-100" />
                        </Link>
                        <Link
                            href="/reservation"
                            className="relative text-sm font-semibold text-[#4c7650] transition-all duration-300 hover:text-[#2d452e] group"
                        >
                            <span className="relative z-10">Réservation</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f6ca73] to-[#4c7650] transition-all duration-300 group-hover:w-full" />
                            <span className="absolute inset-0 -z-10 bg-[#f6ca73]/0 rounded-lg transition-all duration-300 group-hover:bg-[#f6ca73]/10 scale-0 group-hover:scale-100" />
                        </Link>
                        <Link
                            href="/contact"
                            className="relative text-sm font-semibold text-[#4c7650] transition-all duration-300 hover:text-[#2d452e] group"
                        >
                            <span className="relative z-10">Contact</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f6ca73] to-[#4c7650] transition-all duration-300 group-hover:w-full" />
                            <span className="absolute inset-0 -z-10 bg-[#f6ca73]/0 rounded-lg transition-all duration-300 group-hover:bg-[#f6ca73]/10 scale-0 group-hover:scale-100" />
                        </Link>
                    </nav>

                    {/* Logo centré avec animation */}
                    <Link
                        href="/"
                        className="flex items-center justify-center group"
                    >
                        <Image
                            src="/Logo TCH - Vert (header).png"
                            alt="Tennis Club Halluin"
                            width={180}
                            height={75}
                            className={`w-auto object-contain transition-all duration-500 ease-out group-hover:scale-105 ${scrolled ? "h-14" : "h-16"
                                }`}
                        />
                    </Link>

                    {/* Navigation buttons à droite */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/login"
                            className="relative px-5 py-2.5 text-sm font-semibold text-[#4c7650] transition-all duration-300 hover:text-[#2d452e] group overflow-hidden"
                        >
                            <span className="relative z-10">Se connecter</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#f6ca73] to-[#4c7650] transition-all duration-300 group-hover:w-full" />
                        </Link>
                        <Link
                            href="/register"
                            className="relative px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#4c7650] to-[#2d452e] text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(76,118,80,0.4)] hover:scale-105 active:scale-95 overflow-hidden group"
                        >
                            <span className="relative z-10">Créer un compte</span>
                            {/* Animated gradient overlay */}
                            <span className="absolute inset-0 bg-gradient-to-br from-[#639268] via-[#4c7650] to-[#2d452e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            {/* Shine effect */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom shadow gradient */}
            <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4c7650]/20 to-transparent transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"
                }`} />
        </header>
    );
}
