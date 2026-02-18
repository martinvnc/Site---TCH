"use client";

import { Warehouse, Sun, Users, Signal } from "lucide-react";

const highlights = [
    { text: "3 Terrains intérieurs", icon: Warehouse },
    { text: "3 Terrains extérieurs", icon: Sun },
    { text: "Club familial", icon: Users },
    { text: "Tous niveaux", icon: Signal },
];

export default function ScrollingTicker() {
    return (
        <section className="bg-[#2d452e] py-3 border-y border-white/5 overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-y-4 px-4">
                {highlights.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 px-6"
                    >
                        <item.icon className="w-4 h-4 text-[#F6CA73]" />
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">
                            {item.text}
                        </span>
                        {index < highlights.length - 1 && (
                            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20 ml-6" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
