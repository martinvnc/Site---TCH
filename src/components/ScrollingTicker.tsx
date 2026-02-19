"use client";

import { Warehouse, Sun, Users, Signal } from "lucide-react";

const highlights = [
    { text: "3 Terrains intérieurs", icon: Warehouse },
    { text: "3 Terrains extérieurs", icon: Sun },
    { text: "Club familial", icon: Users },
    { text: "Tous niveaux", icon: Signal },
];

export default function ScrollingTicker() {
    // Duplicate for seamless loop
    const duplicatedHighlights = [...highlights, ...highlights, ...highlights];

    return (
        <section className="bg-[#2d452e] py-2 border-y border-white/5 overflow-hidden">
            <div className="flex whitespace-nowrap animate-scroll-ticker w-max">
                {duplicatedHighlights.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-8 px-8"
                    >
                        <div className="flex items-center gap-4">
                            <item.icon className="w-3.5 h-3.5 text-[#F6CA73]" />
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                                {item.text}
                            </span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[#F6CA73]/30" />
                    </div>
                ))}
            </div>
        </section>
    );
}
