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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white shadow-md"
                : "bg-white/90 backdrop-blur-sm"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-3 items-center h-20">
                    {/* Menu navigation à gauche */}
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/club"
                            className="text-sm font-semibold text-[#4c7650] hover:text-[#f6ca73] transition-colors"
                        >
                            Le Club
                        </Link>
                        <Link
                            href="/reservation"
                            className="text-sm font-semibold text-[#4c7650] hover:text-[#f6ca73] transition-colors"
                        >
                            Réservation
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-semibold text-[#4c7650] hover:text-[#f6ca73] transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Logo centré */}
                    <Link href="/" className="flex items-center justify-center">
                        <Image
                            src="/Logo TCH - Vert.png"
                            alt="Tennis Club Halluin"
                            width={180}
                            height={75}
                            className="h-16 w-auto object-contain"
                        />
                    </Link>

                    {/* Navigation buttons à droite */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-semibold text-[#4c7650] hover:text-[#639268] transition-colors"
                        >
                            Se connecter
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 rounded-xl bg-[#4c7650] text-sm font-semibold text-white hover:bg-[#639268] transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            Créer un compte
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
