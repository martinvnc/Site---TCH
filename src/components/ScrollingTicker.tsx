"use client";

import { Warehouse, Sun, Users, Signal } from "lucide-react";

const highlights = [
    { text: "3 Terrains intérieurs", icon: Warehouse },
    { text: "3 Terrains extérieurs", icon: Sun },
    { text: "Club familial", icon: Users },
    { text: "Tous niveaux", icon: Signal },
];

export default function ScrollingTicker() {
    // Duplicate the highlights to ensure a seamless infinite loop
    const duplicatedHighlights = [...highlights, ...highlights, ...highlights, ...highlights];

    return (
        <section className="bg-[#2d452e] py-2 border-y border-white/5 overflow-hidden">
            <div className="flex whitespace-nowrap animate-scroll">
                {duplicatedHighlights.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 px-10"
                    >
                        <item.icon className="w-3.5 h-3.5 text-[#F6CA73]" />
                        <span className="text-white text-xs font-medium tracking-wider">
                            {item.text}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-[#F6CA73]/20 ml-6" />
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    display: flex;
                    width: max-content;
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
