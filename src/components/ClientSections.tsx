"use client";

import dynamic from "next/dynamic";

const ScrollingTicker = dynamic(() => import("@/components/ScrollingTicker"), {
    ssr: false,
    loading: () => <div className="h-8 bg-[#2d452e]" />,
});

const NewsSection = dynamic(() => import("@/components/NewsSection"), {
    ssr: false,
    loading: () => <div className="py-16 bg-white" />,
});

const SocialBanner = dynamic(() => import("@/components/SocialBanner"), {
    ssr: false,
    loading: () => <div className="h-16 bg-[#2d452e]" />,
});

const ResultsSection = dynamic(() => import("@/components/ResultsSection"), {
    ssr: false,
    loading: () => <div className="py-12 bg-white" />,
});

export default function ClientSections() {
    return (
        <>
            <ScrollingTicker />
            <NewsSection />
            <SocialBanner />
            <ResultsSection />
        </>
    );
}
