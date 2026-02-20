import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsSection from "@/components/NewsSection";

export default function ActualitesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />
            <NewsSection isFullPage={true} />
            <Footer />
        </main>
    );
}
