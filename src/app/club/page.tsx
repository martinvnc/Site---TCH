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
            <section className="relative h-[45vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-[#2d452e]">
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
                <div className="relative z-10 text-center px-4">
                    <span className="text-[#F6CA73] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 block animate-fade-in">
                        Depuis 1927
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight animate-fade-in-up">
                        Le Club
                    </h1>
                </div>
            </section>

            {/* Section Héritage & Esprit */}
            <section className="py-20 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d452e] mb-6">Un héritage, une passion</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Implanté au cœur d'Halluin depuis près d'un siècle, le Tennis Club d'Halluin est bien plus qu'une simple infrastructure sportive. C'est un lieu de vie, de rencontre et de transmission où chaque génération vient écrire son histoire.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            {[
                                { icon: Shield, title: "Excellence", desc: "Une formation de qualité pour tous les niveaux." },
                                { icon: Users, title: "Convivialité", desc: "L'esprit club avant tout, dans le respect et l'amitié." },
                                { icon: Trophy, title: "Compétition", desc: "Le goût du défi et le dépassement de soi." }
                            ].map((item, idx) => (
                                <div key={idx} className="group flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/5 flex items-center justify-center mb-6 group-hover:bg-[#4c7650] transition-all duration-500">
                                        <item.icon className="w-8 h-8 text-[#4c7650] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#2d452e] mb-3">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Infrastructures - Premium Grid */}
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d452e] mb-4">Infrastructures d'exception</h2>
                            <p className="text-gray-600">Des équipements de pointe pour une pratique optimale toute l'année, quelles que soient les conditions météo.</p>
                        </div>
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
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
