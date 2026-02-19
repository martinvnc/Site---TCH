import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ClientSections from "@/components/ClientSections";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow">
                <Hero />
                <ClientSections />
            </div>
            <Footer />
        </main>
    );
}
