"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Clock, Instagram, Facebook, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", subject: "", message: ""
    });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
        setTimeout(() => setSent(false), 6000);
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* ── HERO DARK ── */}
            <section className="relative bg-[#2d452e] pt-28 pb-20 px-6 sm:px-10 lg:px-24 overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "32px 32px"
                }} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4c7650]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F6CA73]/10 rounded-full blur-3xl translate-y-1/2" />

                <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div>
                        <span className="inline-block px-3 py-1 bg-[#F6CA73]/20 text-[#F6CA73] text-[10px] font-black uppercase tracking-widest rounded-lg mb-6">
                            Tennis Club d'Halluin
                        </span>
                        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-5">
                            On est là<br />
                            <span className="text-[#F6CA73]">pour vous.</span>
                        </h1>
                        <p className="text-white/60 font-medium leading-relaxed max-w-sm text-lg">
                            Une question sur le club, une inscription, un renseignement&nbsp;? Écrivez-nous, on répond vite.
                        </p>

                        {/* Quick contact chips */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href="mailto:contact@tch-tennis.fr"
                                className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white text-sm font-bold">
                                <Mail className="w-4 h-4 text-[#F6CA73]" />
                                contact@tch-tennis.fr
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                            <a href="tel:+33320202020"
                                className="group flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white text-sm font-bold">
                                <Phone className="w-4 h-4 text-[#F6CA73]" />
                                03 20 20 20 20
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>

                    {/* Horaires card floated right */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-[#F6CA73]/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-[#F6CA73]" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-white/60">Horaires du secrétariat</p>
                        </div>
                        <ul className="space-y-4">
                            {[
                                { day: "Lundi — Vendredi", hours: "14h00 – 19h00", open: true },
                                { day: "Samedi", hours: "09h00 – 12h00", open: true },
                                { day: "Dimanche", hours: "Fermé", open: false },
                            ].map(({ day, hours, open }) => (
                                <li key={day} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                                    <span className="text-white/50 font-medium text-sm">{day}</span>
                                    <span className={`font-black text-sm ${open ? "text-white" : "text-white/25"}`}>{hours}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-white/40 font-medium">Secrétariat ouvert aujourd'hui</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="py-20 px-6 sm:px-10 lg:px-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                    {/* Form */}
                    <div>
                        <h2 className="text-3xl font-black text-[#2d452e] mb-2">Envoyez-nous un message</h2>
                        <div className="w-10 h-1 bg-[#F6CA73] rounded-full mb-8" />

                        {sent ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-5 bg-[#4c7650]/5 rounded-[2rem] border border-[#4c7650]/10">
                                <div className="w-16 h-16 rounded-2xl bg-[#4c7650]/15 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-[#4c7650]" strokeWidth={1.8} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#2d452e] mb-1">Message envoyé !</h3>
                                    <p className="text-zinc-500 font-medium text-sm">On vous recontacte dans les meilleurs délais.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Prénom", key: "firstName", placeholder: "Jean" },
                                        { label: "Nom", key: "lastName", placeholder: "Dupont" },
                                    ].map(({ label, key, placeholder }) => (
                                        <div key={key} className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4c7650]">{label}</label>
                                            <input
                                                type="text" required placeholder={placeholder}
                                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/40 focus:bg-white outline-none transition-all text-[#2d452e] font-medium placeholder:text-zinc-300"
                                                value={(formData as any)[key]}
                                                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4c7650]">E-mail</label>
                                    <input type="email" required placeholder="jean@exemple.com"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/40 focus:bg-white outline-none transition-all text-[#2d452e] font-medium placeholder:text-zinc-300"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4c7650]">Sujet</label>
                                    <input type="text" required placeholder="Inscription, renseignement, stage..."
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/40 focus:bg-white outline-none transition-all text-[#2d452e] font-medium placeholder:text-zinc-300"
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4c7650]">Message</label>
                                    <textarea rows={6} required placeholder="Comment pouvons-nous vous aider ?"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border-2 border-transparent focus:border-[#4c7650]/40 focus:bg-white outline-none transition-all resize-none text-[#2d452e] font-medium placeholder:text-zinc-300"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                </div>
                                <button type="submit"
                                    className="w-full py-4 rounded-xl bg-[#2d452e] hover:bg-[#4c7650] text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group mt-2">
                                    Envoyer le message
                                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right: Map + Social */}
                    <div className="flex flex-col gap-6">
                        {/* Map */}
                        <div className="rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm h-72 sm:h-80">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1258!2d3.126!3d50.779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2e5b8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sHalluin%2C%2059250!5e0!3m2!1sfr!2sfr!4v1"
                                width="100%" height="100%"
                                style={{ border: 0 }}
                                allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localisation Tennis Club d'Halluin"
                            />
                        </div>

                        {/* Address */}
                        <a href="https://maps.google.com?q=Halluin+59250"
                            target="_blank" rel="noopener noreferrer"
                            className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-11 h-11 rounded-xl bg-[#4c7650]/10 flex items-center justify-center text-[#4c7650] shrink-0 group-hover:bg-[#4c7650] group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Adresse</p>
                                <p className="font-bold text-[#2d452e] text-sm">Rue du Tennis, Halluin — 59250</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-[#4c7650] transition-colors" />
                        </a>

                        {/* Socials */}
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/tennis_club_halluin" target="_blank" rel="noopener noreferrer"
                                className="group flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-50 hover:bg-[#2d452e] border border-zinc-100 hover:border-[#2d452e] transition-all">
                                <Instagram className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Instagram</span>
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                                className="group flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-50 hover:bg-[#2d452e] border border-zinc-100 hover:border-[#2d452e] transition-all">
                                <Facebook className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" strokeWidth={2} />
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
