import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

// Lazy load heavy components to avoid mobile crash
// They load after the initial render (Hero visible first)
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
