import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MentionsLegales() {
    return (
        <main className="bg-white min-h-screen flex flex-col pt-40">
            <Header />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow mb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-[#2d452e] uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            Mentions Légales
                        </h1>
                        <div className="w-24 h-1.5 bg-[#F6CA73] mx-auto rounded-full animate-in fade-in fill-mode-both delay-300 duration-700" />
                    </div>

                    {/* Content Section */}
                    <div className="space-y-12 text-[#2d452e]/80 leading-loose prose prose-green max-w-none">
                        <section className="bg-[#f8f9f5]/50 p-8 md:p-10 rounded-[32px] border border-[#4c7650]/10 shadow-sm transition-all hover:shadow-md">
                            <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-widest mb-6 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#4c7650]/30 rounded-full" />
                                1. Éditeur du site
                            </h2>
                            <p className="font-medium">
                                Le site internet <span className="text-[#4c7650] font-bold">Tennis Club d'Halluin</span> est édité par l'association loi 1901 :
                            </p>
                            <ul className="mt-4 space-y-2 list-none p-0">
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6CA73]" />
                                    <span className="font-bold">Nom :</span> Tennis Club d'Halluin (TCH)
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6CA73]" />
                                    <span className="font-bold">Adresse :</span> 341 Rue de la Lys, 59250 Halluin
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6CA73]" />
                                    <span className="font-bold">Email :</span> contact@tch.fr
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#F6CA73]" />
                                    <span className="font-bold">Affiliation :</span> Fédération Française de Tennis (FFT)
                                </li>
                            </ul>
                        </section>

                        <section className="bg-white p-8 md:p-10 rounded-[32px] border border-[#4c7650]/5 shadow-sm transition-all hover:shadow-md">
                            <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-widest mb-6 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#4c7650]/30 rounded-full" />
                                2. Hébergement
                            </h2>
                            <p className="font-medium">
                                Le site est hébergé par la plateforme <span className="text-[#4c7650] font-bold">Vercel</span> :
                            </p>
                            <p className="mt-4 italic text-sm">
                                Vercel Inc.<br />
                                340 S Lemon Ave #4133<br />
                                Walnut, CA 91789<br />
                                États-Unis
                            </p>
                        </section>

                        <section className="bg-[#f8f9f5]/50 p-8 md:p-10 rounded-[32px] border border-[#4c7650]/10 shadow-sm transition-all hover:shadow-md">
                            <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-widest mb-6 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#4c7650]/30 rounded-full" />
                                3. Propriété intellectuelle
                            </h2>
                            <p className="font-medium">
                                L'ensemble du contenu de ce site (textes, images, logos, éléments graphiques) est la propriété exclusive du Tennis Club d'Halluin, sauf mention contraire.
                            </p>
                            <p className="mt-4 text-sm leading-relaxed">
                                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
                            </p>
                        </section>

                        <section className="bg-white p-8 md:p-10 rounded-[32px] border border-[#4c7650]/5 shadow-sm transition-all hover:shadow-md">
                            <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-widest mb-6 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#4c7650]/30 rounded-full" />
                                5. Utilisation des cookies
                            </h2>
                            <p className="font-medium">
                                Ce site utilise exclusivement des cookies techniques nécessaires à son bon fonctionnement.
                            </p>
                            <p className="mt-4 text-sm leading-relaxed">
                                Ces cookies (via Supabase) permettent de maintenir votre session ouverte et sont indispensables pour accéder à l'espace de réservation. Aucune donnée à des fins publicitaires ou de traçage n'est collectée.
                            </p>
                        </section>

                        <section className="bg-[#f8f9f5]/50 p-8 md:p-10 rounded-[32px] border border-[#4c7650]/10 shadow-sm transition-all hover:shadow-md">
                            <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-widest mb-6 flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#4c7650]/30 rounded-full" />
                                6. Crédits
                            </h2>
                            <p className="font-medium italic">
                                Site réalisé pour le Tennis Club d'Halluin.
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
