import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ScrollingTicker from "@/components/ScrollingTicker";
import NewsSection from "@/components/NewsSection";
import SocialBanner from "@/components/SocialBanner";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";

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
