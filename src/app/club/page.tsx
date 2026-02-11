"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Users, Shield, Trophy, Target, Star, MapPin, Clock } from "lucide-react";

export default function ClubPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-[#4c7650]/10 selection:text-[#4c7650]">
            <Header />

            {/* Hero Section Épurée */}
            <section className="relative h-[30vh] sm:h-[35vh] flex items-center justify-center overflow-hidden bg-[#2d452e]">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2d452e]" />
                    <Image
                        src="/hero-indoor-new.jpeg"
                        alt="Tennis Club Halluin"
                        fill
                        className="object-cover opacity-50 grayscale-[20%]"
                        priority
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                    <Image
                        src="/Logo TCH - Blanc.png"
                        alt="Logo Tennis Club Halluin"
                        width={240}
                        height={120}
                        sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 450px"
                        className="w-auto h-28 sm:h-32 md:h-36 lg:h-44 xl:h-52 object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                        priority
                        quality={90}
                    />
                </div>
            </section>

            {/* Section Héritage & Esprit */}
            <section className="py-16 sm:py-24 relative overflow-hidden bg-white">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4c7650]/20 to-transparent" />

                <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-24">
                            <div className="lg:w-1/2">
                                <h2 className="text-4xl sm:text-5xl font-extrabold text-[#2d452e] mb-8 tracking-tight leading-tight">
                                    Un héritage, <br />
                                    <span className="text-[#4c7650]">une passion.</span>
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-[#2d452e]/90 text-lg sm:text-xl leading-relaxed font-medium">
                                        Implanté au cœur d'Halluin depuis près d'un siècle, le Tennis Club d'Halluin est bien plus qu'une simple infrastructure sportive.
                                    </p>
                                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                        C'est un lieu de vie, de rencontre et de transmission où chaque génération vient écrire son histoire. Notre engagement envers l'excellence et la convivialité reste le moteur de notre développement quotidien.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <div className="relative aspect-square w-full max-w-md mx-auto">
                                    <div className="absolute inset-0 rounded-[2.5rem] bg-[#4c7650]/5 -rotate-6 transform transition-transform group-hover:rotate-0 duration-700" />
                                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-[#4c7650]/10 rotate-3" />
                                    <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <Image
                                            src="/hero-indoor-new.jpeg"
                                            alt="L'esprit TCH"
                                            fill
                                            className="object-cover scale-110 transition-transform duration-700 hover:scale-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                            {[
                                { icon: Shield, title: "Excellence", desc: "Une formation de qualité supérieure adaptée à chaque profil de joueur.", color: "bg-blue-50 text-blue-600" },
                                { icon: Users, title: "Convivialité", desc: "Un esprit de famille unique qui fait la force de notre communauté.", color: "bg-orange-50 text-orange-600" },
                                { icon: Trophy, title: "Compétition", desc: "Le goût du challenge porté par des équipes passionnées et soudées.", color: "bg-green-50 text-green-600" }
                            ].map((item, idx) => (
                                <div key={idx} className="relative p-8 rounded-3xl bg-gray-50/50 border border-gray-100/50 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-500 group">
                                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2d452e] mb-4">{item.title}</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Infrastructures - Premium Grid */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#2d452e] mb-4">Infrastructures d'exception</h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Des équipements de pointe pour une pratique optimale toute l'année, quelles que soient les conditions météo.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="/club_infrastructure_courts_1770633502687.png"
                                    alt="Courts intérieurs"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Disponible</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Courts Intérieurs</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    2 courts de tennis couverts en résine haute performance, offrant un confort de jeu optimal et une visibilité parfaite grâce à un éclairage LED de dernière génération.
                                </p>
                                <div className="flex items-center gap-4 text-[#4c7650]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Surface</span>
                                        <span className="text-xs font-bold">Résine (Hard Court)</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Éclairage</span>
                                        <span className="text-xs font-bold">LED Pro 500 Lux</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="/hero-tch-indoor.jpg"
                                    alt="Courts extérieurs"
                                    fill
                                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Plein air</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Terre Battue</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Profitez de nos courts extérieurs pendant la saison estivale. Un cadre verdoyant et paisible pour travailler votre endurance et votre précision.
                                </p>
                                <div className="flex items-center gap-4 text-[#4c7650]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Surface</span>
                                        <span className="text-xs font-bold">Classic Clay</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Cadre</span>
                                        <span className="text-xs font-bold">Eco-responsable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 hover:-translate-y-2">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src="/hero-indoor-new.jpeg"
                                    alt="Clubhouse"
                                    fill
                                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-[#F6CA73]" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Espace de vie</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Clubhouse & Détente</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    Notre clubhouse est le cœur battant du club. Un espace convivial pour échanger après un match ou suivre les tournois majeurs sur grand écran.
                                </p>
                                <div className="flex items-center gap-4 text-[#4c7650]">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Bar</span>
                                        <span className="text-xs font-bold">Espace détente</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-100" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Vue</span>
                                        <span className="text-xs font-bold">Panoramique courts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section Final */}
            <section className="py-20 sm:py-32 bg-[#2d452e] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#4c7650]/5 -skew-x-12 transform translate-x-1/2" />
                <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24 relative z-10 text-center">
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-8">Prêt à entrer sur le court ?</h2>
                    <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
                        Que vous soyez débutant ou compétiteur chevronné, il y a une place pour vous au Tennis Club d'Halluin.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/reservation"
                            className="w-full sm:w-auto px-10 py-5 bg-[#F6CA73] text-[#2d452e] font-bold rounded-2xl hover:bg-[#ffda8f] hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            Réserver un court
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 border border-white/20 hover:scale-105 active:scale-95 transition-all backdrop-blur-sm"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
