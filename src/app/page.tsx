import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NewsSection from "@/components/NewsSection";
import CTASection from "@/components/CTASection";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Header />
            <Hero />
            <NewsSection />
            <CTASection />

            {/* Footer */}
            <footer className="bg-[#2d452e] text-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-[#f6ca73]">Contact</h3>
                            <p className="text-white/80 mb-2">Tennis Club d'Halluin</p>
                            <p className="text-white/80 mb-2">📍 Rue du Tennis, Halluin</p>
                            <p className="text-white/80 mb-2">📧 contact@tch-tennis.fr</p>
                            <p className="text-white/80">📞 03 XX XX XX XX</p>
                        </div>

                        {/* Navigation rapide */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-[#f6ca73]">Navigation</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#actualites" className="text-white/80 hover:text-[#f6ca73] transition-colors">
                                        Actualités
                                    </a>
                                </li>
                                <li>
                                    <a href="/reservation" className="text-white/80 hover:text-[#f6ca73] transition-colors">
                                        Réservation
                                    </a>
                                </li>
                                <li>
                                    <a href="/entrainement" className="text-white/80 hover:text-[#f6ca73] transition-colors">
                                        Entraînement
                                    </a>
                                </li>
                                <li>
                                    <a href="/about" className="text-white/80 hover:text-[#f6ca73] transition-colors">
                                        À propos
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Horaires */}
                        <div>
                            <h3 className="text-lg font-bold mb-4 text-[#f6ca73]">Horaires d'ouverture</h3>
                            <p className="text-white/80 mb-2">Lundi - Vendredi : 9h - 22h</p>
                            <p className="text-white/80 mb-2">Samedi - Dimanche : 8h - 20h</p>
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
                        <p>&copy; 2026 Tennis Club d'Halluin. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
