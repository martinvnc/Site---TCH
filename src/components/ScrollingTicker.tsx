"use client";

import { Warehouse, Sun, Users, Signal } from "lucide-react";

const highlights = [
    { text: "3 Terrains intérieurs", icon: Warehouse },
    { text: "3 Terrains extérieurs", icon: Sun },
    { text: "Club familial", icon: Users },
    { text: "Tous niveaux", icon: Signal },
];

export default function ScrollingTicker() {
    // Duplicate exactly once for seamless loops with translateX(-50%)
    const duplicatedHighlights = [...highlights, ...highlights];

    return (
        <section className="bg-[#2d452e] py-3 border-y border-white/5 overflow-hidden">
            <div className="flex whitespace-nowrap animate-scroll-ticker w-max">
                {duplicatedHighlights.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-12"
                    >
                        <item.icon className="w-4 h-4 text-[#F6CA73]" />
                        <span className="text-white text-xs font-bold tracking-widest uppercase">
                            {item.text}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F6CA73]/30 ml-8" />
                    </div>
                ))}
            </div>
        </section>
    );
}
