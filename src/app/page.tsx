import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollingTicker from "@/components/ScrollingTicker";

// Chargement différé des sections sous la fold
const NewsSection = dynamic(() => import("@/components/NewsSection"), {
    loading: () => <div className="py-20" />,
});
const SocialBanner = dynamic(() => import("@/components/SocialBanner"));
const ResultsSection = dynamic(() => import("@/components/ResultsSection"), {
    loading: () => <div className="py-20" />,
});
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow">
                <Hero />
                <ScrollingTicker />
                <NewsSection />
                <SocialBanner />
                <ResultsSection />
            </div>
            <Footer />
        </main>
    );
}
