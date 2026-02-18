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
            <div className="relative group bg-[#2d452e] py-5 sm:py-6 px-6 sm:px-10 lg:px-24 overflow-hidden border-y border-[#4c7650]/30 shadow-2xl transition-colors duration-500 hover:bg-[#344d34]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F6CA73]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight text-center md:text-left tracking-tight">
                            <span className="text-[#F6CA73] inline-block hover:scale-105 transition-transform duration-300 cursor-default">Suivez-nous</span> sur les réseaux
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-3 px-8 py-3 bg-white text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <Facebook className="w-5 h-5 fill-current group-hover/btn:rotate-12 transition-transform" />
                            <span className="text-xs uppercase tracking-widest">Facebook</span>
                        </Link>

                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn relative flex items-center gap-3 px-8 py-3 bg-[#F6CA73] text-[#2d452e] rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <Instagram className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            <span className="text-xs uppercase tracking-widest">Instagram</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
