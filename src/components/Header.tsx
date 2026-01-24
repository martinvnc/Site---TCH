"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Calendar } from "lucide-react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (menuOpen && !(e.target as Element).closest('.user-menu')) {
                setMenuOpen(false);
            }
        };

        // Auth state
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousedown", handleClickOutside);
            subscription.unsubscribe();
        };
    }, [menuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
        window.location.href = "/";
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
                ? "bg-white/98 backdrop-blur-2xl shadow-[0_8px_32px_rgba(76,118,80,0.12)] border-b border-[#4c7650]/15"
                : "bg-white/90 backdrop-blur-xl border-b border-transparent"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 transition-all duration-700">
                    {/* Groupe Gauche : Logo + Nav */}
                    <div className="flex items-center gap-10">
                        <Link
                            href="/"
                            className="flex items-center group shrink-0 relative"
                        >
                            <div className="absolute -inset-4 bg-[#4c7650]/5 rounded-full blur-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                            <Image
                                src="/Logo TCH - Vert (header).png"
                                alt="Tennis Club Halluin"
                                width={180}
                                height={75}
                                className="w-auto object-contain relative z-10 transition-all duration-500 ease-out group-hover:scale-105 h-11"
                            />
                        </Link>

                        {/* Menu navigation avec micro-interactions */}
                        <nav className="hidden lg:flex items-center gap-2">
                            {[
                                { name: "Accueil", href: "/" },
                                { name: "Le Club", href: "/club" },
                                { name: "Réservation", href: user ? "/reservation" : "/login" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-5 py-2.5 text-base font-semibold tracking-tight text-[#4c7650] transition-colors duration-300 hover:text-[#2d452e] group overflow-hidden rounded-xl"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <span className="absolute inset-0 bg-gradient-to-br from-[#4c7650]/5 to-[#4c7650]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#4c7650] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Navigation buttons à droite */}
                    <div className="flex items-center justify-end gap-4 shrink-0">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="relative hidden sm:flex items-center justify-center px-6 py-3 text-base font-bold tracking-tight text-[#4c7650] border-2 border-[#4c7650]/20 rounded-xl transition-all duration-300 hover:border-[#4c7650] hover:bg-[#4c7650]/5 active:scale-95 h-[52px] min-w-[160px] group"
                                >
                                    <span className="relative z-10">Se connecter</span>
                                </Link>

                                <Link
                                    href="/register"
                                    className="relative flex items-center justify-center px-6 py-3 rounded-xl bg-[#4c7650] text-base font-bold tracking-tight text-white transition-all duration-300 hover:bg-[#3a5a3d] hover:shadow-[0_12px_28px_rgba(76,118,80,0.3)] hover:scale-[1.03] active:scale-[0.98] h-[52px] min-w-[160px] group"
                                >
                                    <span className="relative z-10">S'inscrire</span>
                                </Link>
                            </>
                        ) : (
                            <div className="relative user-menu">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4c7650]/5 text-[#4c7650] transition-all duration-300 hover:bg-[#4c7650] hover:text-white border border-[#4c7650]/10 ${menuOpen ? 'bg-[#4c7650] text-white ring-4 ring-[#4c7650]/10' : ''}`}
                                >
                                    <UserIcon className={`w-6 h-6 transition-transform duration-500 ${menuOpen ? 'rotate-[360deg]' : ''}`} />
                                </button>

                                {/* Account Dropdown */}
                                {menuOpen && (
                                    <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[32px] border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-xl">
                                        <div className="p-6 bg-[#4c7650]/5 border-b border-[#4c7650]/10">
                                            <p className="text-sm font-bold text-[#4c7650] uppercase tracking-wider mb-1">Mon Compte</p>
                                            <p className="text-[#2d452e] font-bold truncate">{user.email}</p>
                                        </div>

                                        <div className="p-3">
                                            <Link
                                                href="/mes-reservations"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-[#4c7650]/5 text-[#2d452e] font-semibold transition-all group"
                                            >
                                                <Calendar className="w-5 h-5 text-[#4c7650]" />
                                                <span>Mes Réservations</span>
                                            </Link>

                                            <div className="relative group px-4 py-3 rounded-2xl opacity-60 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <UserIcon className="w-5 h-5 text-[#4c7650]" />
                                                    <span className="font-semibold text-[#2d452e]">Mon Profil</span>
                                                </div>
                                                <span className="text-[10px] bg-[#4c7650]/10 text-[#4c7650] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Bientôt</span>
                                            </div>

                                            <div className="relative group px-4 py-3 rounded-2xl opacity-60 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <LogOut className="w-5 h-5 text-[#4c7650]" rotate={180} />
                                                    <span className="font-semibold text-[#2d452e]">Paramètres</span>
                                                </div>
                                                <span className="text-[10px] bg-[#4c7650]/10 text-[#4c7650] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Bientôt</span>
                                            </div>

                                            <div className="h-[1px] bg-[#4c7650]/10 my-2 mx-2" />

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl hover:bg-red-50 text-red-600 font-bold transition-all group"
                                            >
                                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                                <span>Déconnexion</span>
                                            </button>
                                        </div>

                                        <div className="p-4 bg-zinc-50 flex items-center justify-center">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Tennis Club Halluin</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom transition border - Always visible for definition */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4c7650]/20 to-transparent transition-opacity duration-700 opacity-100" />
        </header>
    );
}
