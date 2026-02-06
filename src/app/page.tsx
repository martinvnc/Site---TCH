import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="bg-white">
            <Header />
            <Hero />
            <NewsSection />
            <CTASection />
            <Footer />
        </main>
    );
}
