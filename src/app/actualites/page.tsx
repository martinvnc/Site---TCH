"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

export default function ActualitesPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow">
                {/* On réutilise le Hero mais on pourrait le spécialiser si besoin */}
                <Hero />
                <NewsSection isFullPage={true} />
            </div>
            <Footer />
        </main>
    );
}
