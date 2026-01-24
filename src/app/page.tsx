import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow">
                <Hero />
                <NewsSection />
                <CTASection />
            </div>
            <Footer />
        </main>
    );
}
