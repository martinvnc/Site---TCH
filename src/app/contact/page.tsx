"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Clock, Instagram, Facebook, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 5000);
    };

    const infoCards = [
        {
            icon: MapPin,
            label: "Adresse",
            value: "Rue du Tennis, Halluin 59250",
            href: "https://maps.google.com?q=Rue+du+Tennis+Halluin+59250"
        },
        {
            icon: Mail,
            label: "E-mail",
            value: "contact@tch-tennis.fr",
            href: "mailto:contact@tch-tennis.fr"
        },
        {
            icon: Phone,
            label: "Téléphone",
            value: "03 20 20 20 20",
            href: "tel:+33320202020"
        },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* ── Hero ── */}
            <section className="pt-28 pb-12 px-6 sm:px-10 lg:px-24 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-black uppercase tracking-widest text-[#4c7650] mb-4">Tennis Club d'Halluin</p>
                    <h1 className="text-5xl sm:text-6xl font-black text-[#2d452e] leading-tight mb-4">
                        Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4c7650] to-[#2d452e]">nous</span>
                    </h1>
                    <div className="w-16 h-1.5 bg-[#F6CA73] rounded-full mb-5" />
                    <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
                        Une question sur le club, une inscription, un renseignement ? On vous répond dans les plus brefs délais.
                    </p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="pb-28 px-6 sm:px-10 lg:px-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* ── Form ── */}
                    <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-8 sm:p-10">
                        {sent ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-[#4c7650]" strokeWidth={1.8} />
                                </div>
                                <h2 className="text-2xl font-black text-[#2d452e]">Message envoyé !</h2>
                                <p className="text-zinc-500 font-medium max-w-xs">Merci, nous vous recontacterons dans les meilleurs délais.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-black text-[#2d452e] mb-8">Envoyer un message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#4c7650]">Prénom</label>
                                            <input
                                                type="text" required placeholder="Jean"
                                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/30 focus:bg-white outline-none transition-all placeholder:text-zinc-300 text-[#2d452e] font-medium"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-[#4c7650]">Nom</label>
                                            <input
                                                type="text" required placeholder="Dupont"
                                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/30 focus:bg-white outline-none transition-all placeholder:text-zinc-300 text-[#2d452e] font-medium"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#4c7650]">E-mail</label>
                                        <input
                                            type="email" required placeholder="jean@exemple.com"
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/30 focus:bg-white outline-none transition-all placeholder:text-zinc-300 text-[#2d452e] font-medium"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#4c7650]">Sujet</label>
                                        <input
                                            type="text" required placeholder="Inscription, renseignement, stage..."
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/30 focus:bg-white outline-none transition-all placeholder:text-zinc-300 text-[#2d452e] font-medium"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#4c7650]">Message</label>
                                        <textarea
                                            rows={6} required placeholder="Comment pouvons-nous vous aider ?"
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/30 focus:bg-white outline-none transition-all resize-none placeholder:text-zinc-300 text-[#2d452e] font-medium"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-xl bg-[#2d452e] hover:bg-[#4c7650] text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Envoyer le message
                                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* ── Right Column ── */}
                    <div className="flex flex-col gap-6">

                        {/* Info Cards */}
                        {infoCards.map(({ icon: Icon, label, value, href }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="group flex items-center gap-5 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#4c7650]/10 flex items-center justify-center text-[#4c7650] shrink-0 group-hover:bg-[#4c7650] group-hover:text-white transition-colors">
                                    <Icon className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
                                    <p className="font-bold text-[#2d452e] text-sm">{value}</p>
                                </div>
                            </a>
                        ))}

                        {/* Horaires */}
                        <div className="p-8 rounded-2xl bg-[#2d452e] text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="w-5 h-5 text-[#F6CA73]" strokeWidth={2} />
                                <h3 className="font-black text-sm uppercase tracking-widest text-white">Horaires du secrétariat</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    { day: "Lundi — Vendredi", hours: "14h00 – 19h00" },
                                    { day: "Samedi", hours: "09h00 – 12h00" },
                                    { day: "Dimanche", hours: "Fermé" },
                                ].map(({ day, hours }) => (
                                    <li key={day} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                        <span className="text-white/60 font-medium text-sm">{day}</span>
                                        <span className={`font-black text-sm ${hours === "Fermé" ? "text-white/30" : "text-white"}`}>{hours}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social */}
                        <div className="flex gap-3">
                            <a
                                href="https://www.instagram.com/tennis_club_halluin"
                                target="_blank" rel="noopener noreferrer"
                                className="group flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-zinc-100 hover:border-[#4c7650] hover:bg-[#4c7650]/5 transition-all"
                            >
                                <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-[#4c7650] transition-colors" strokeWidth={2} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#4c7650] transition-colors">Instagram</span>
                            </a>
                            <a
                                href="https://www.facebook.com"
                                target="_blank" rel="noopener noreferrer"
                                className="group flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-zinc-100 hover:border-[#4c7650] hover:bg-[#4c7650]/5 transition-all"
                            >
                                <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-[#4c7650] transition-colors" strokeWidth={2} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-[#4c7650] transition-colors">Facebook</span>
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Map ── */}
            <section className="pb-20 px-6 sm:px-10 lg:px-24">
                <div className="max-w-6xl mx-auto rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm h-72 sm:h-96">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.5!2d3.12!3d50.78!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2e5c5b5a5b5a5%3A0x5b5a5b5a5b5a5b5a!2sHalluin%2C%2059250!5e0!3m2!1sfr!2sfr!4v1"
                        width="100%" height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localisation Tennis Club d'Halluin"
                    />
                </div>
            </section>

            <Footer />
        </main>
    );
}
