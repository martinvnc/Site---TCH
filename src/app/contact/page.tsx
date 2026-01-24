"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Merci pour votre message ! Nous vous recontacterons bientôt.");
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-8 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d452e] mb-6 leading-tight">
                        Contactez-nous
                    </h1>
                    <p className="text-xl text-[#2d452e]/70 mb-8 leading-relaxed">
                        Besoin de nous contacter ? Écrivez-nous un message !
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="pb-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

                        {/* Form Column - Left */}
                        <div className="relative order-2 lg:order-1 flex">
                            <div className="w-full bg-white p-12 rounded-[40px] border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)] flex flex-col">
                                <h2 className="text-3xl font-bold text-[#2d452e] mb-12">Envoyez-nous un message</h2>
                                <form onSubmit={handleSubmit} className="space-y-8 flex-grow flex flex-col">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-[#2d452e]/80 ml-1">Prénom</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Jean"
                                                className="w-full px-6 py-4.5 rounded-2xl bg-[#4c7650]/5 border border-transparent focus:border-[#4c7650] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#2d452e]/40 text-[#2d452e]"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-[#2d452e]/80 ml-1">Nom</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Dupont"
                                                className="w-full px-6 py-4.5 rounded-2xl bg-[#4c7650]/5 border border-transparent focus:border-[#4c7650] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#2d452e]/40 text-[#2d452e]"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-[#2d452e]/80 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="jean@example.com"
                                            className="w-full px-6 py-4.5 rounded-2xl bg-[#4c7650]/5 border border-transparent focus:border-[#4c7650] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#2d452e]/40 text-[#2d452e]"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-[#2d452e]/80 ml-1">Sujet</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Demande d'inscription, bug, question..."
                                            className="w-full px-6 py-4.5 rounded-2xl bg-[#4c7650]/5 border border-transparent focus:border-[#4c7650] focus:bg-white outline-none transition-all duration-300 placeholder:text-[#2d452e]/40 text-[#2d452e]"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3 flex-grow flex flex-col">
                                        <label className="text-sm font-bold text-[#2d452e]/80 ml-1">Message</label>
                                        <textarea
                                            rows={10}
                                            required
                                            placeholder="Comment pouvons-nous vous aider ?"
                                            className="w-full px-6 py-4.5 rounded-2xl bg-[#4c7650]/5 border border-transparent focus:border-[#4c7650] focus:bg-white outline-none transition-all duration-300 resize-none flex-grow placeholder:text-[#2d452e]/40 text-[#2d452e]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-5 rounded-2xl bg-[#4c7650] hover:bg-[#2d452e] text-white font-bold text-xl transition-all duration-300 shadow-lg shadow-[#4c7650]/20 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden group mt-4"
                                    >
                                        Envoyer le message
                                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Information Column - Right */}
                        <div className="space-y-8 order-1 lg:order-2 flex flex-col">
                            {/* Contact Card Set */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="group p-10 rounded-[40px] bg-white border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)] transition-all duration-300">
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/10 flex items-center justify-center text-[#4c7650] shrink-0 group-hover:bg-[#4c7650] group-hover:text-white transition-colors duration-300">
                                            <MapPin className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#2d452e] mb-1">Notre Adresse</h3>
                                            <p className="text-lg text-[#2d452e]/60">Rue du Tennis, Halluin, 59250</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group p-10 rounded-[40px] bg-white border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)] transition-all duration-300">
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/10 flex items-center justify-center text-[#4c7650] shrink-0 group-hover:bg-[#4c7650] group-hover:text-white transition-colors duration-300">
                                            <Mail className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#2d452e] mb-1">E-mail</h3>
                                            <p className="text-lg text-[#2d452e]/60">contact@tch-tennis.fr</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group p-10 rounded-[40px] bg-white border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)] transition-all duration-300">
                                    <div className="flex items-center gap-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/10 flex items-center justify-center text-[#4c7650] shrink-0 group-hover:bg-[#4c7650] group-hover:text-white transition-colors duration-300">
                                            <Phone className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#2d452e] mb-1">Téléphone</h3>
                                            <p className="text-lg text-[#2d452e]/60">03 20 20 20 20</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hours Card */}
                            <div className="flex-grow p-12 rounded-[40px] bg-[#2d452e] text-white shadow-[0_20px_50px_rgba(45,69,46,0.2)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
                                <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-3">
                                    <Clock className="w-6 h-6 text-white" /> Horaires de Secrétariat
                                </h3>
                                <ul className="space-y-6 text-white/90">
                                    <li className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="font-medium text-white/70">Lundi - Vendredi</span>
                                        <span className="font-bold text-white tracking-tight">14h00 - 19h00</span>
                                    </li>
                                    <li className="flex justify-between border-b border-white/5 pb-4">
                                        <span className="font-medium text-white/70">Samedi</span>
                                        <span className="font-bold text-white tracking-tight">09h00 - 12h00</span>
                                    </li>
                                    <li className="flex justify-between pt-2">
                                        <span className="font-medium text-white/40">Dimanche</span>
                                        <span className="text-white/30 italic font-medium">Fermé</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
