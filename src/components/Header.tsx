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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] border-b py-2.5 ${scrolled
                ? "bg-white/98 backdrop-blur-xl shadow-[0_10px_30px_rgba(45,69,46,0.08)] border-[#4c7650]/10"
                : "bg-white/95 backdrop-blur-md border-[#4c7650]/5"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Groupe Gauche : Logo + Nav */}
                    <div className="flex items-center gap-12">
                        <Link
                            href="/"
                            className="flex items-center group shrink-0"
                        >
                            <Image
                                src="/Logo TCH - Vert (header).png"
                                alt="Tennis Club Halluin"
                                width={160}
                                height={65}
                                className="w-auto h-10 object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>

                        {/* Menu navigation épuré */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {[
                                { name: "Accueil", href: "/" },
                                { name: "Le Club", href: "/club" },
                                { name: "Réservation", href: user ? "/reservation" : "/login" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-5 py-2 text-sm font-medium tracking-wide text-[#2d452e] transition-all duration-300 hover:text-[#4c7650] group"
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    <span className="absolute bottom-1 left-5 right-5 h-[1.5px] bg-[#F6CA73] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Navigation buttons à droite */}
                    <div className="flex items-center gap-4 shrink-0">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center justify-center px-5 py-2 text-sm font-medium text-[#4c7650] border border-[#4c7650]/40 rounded-full transition-all duration-300 hover:border-[#4c7650] hover:bg-[#4c7650]/5 hover:scale-105 active:scale-95"
                                >
                                    Se connecter
                                </Link>

                                <Link
                                    href="/register"
                                    className="relative flex items-center justify-center px-6 py-2.5 rounded-full bg-[#4c7650] text-sm font-medium text-white transition-all duration-500 hover:bg-[#3d5f41] hover:shadow-[0_10px_25px_rgba(76,118,80,0.2)] hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
                                >
                                    <span className="relative z-10">S'inscrire</span>
                                </Link>
                            </>
                        ) : (
                            <div className="relative user-menu">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 border ${menuOpen
                                        ? 'bg-[#4c7650] text-white border-[#4c7650]'
                                        : 'bg-[#4c7650]/5 text-[#4c7650] border-[#4c7650]/10 hover:bg-[#4c7650]/10'
                                        }`}
                                >
                                    <UserIcon className={`w-5 h-5 transition-transform duration-500 ${menuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Modern minimaliste */}
                                {menuOpen && (
                                    <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-[24px] border border-[#2d452e]/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                                        <div className="p-5 bg-gradient-to-br from-[#4c7650]/5 to-transparent border-b border-[#2d452e]/5 leading-tight">
                                            <p className="text-[10px] font-bold text-[#4c7650]/40 uppercase tracking-widest mb-1">Session active</p>
                                            <p className="text-[#2d452e] font-bold truncate">{user.email?.split('@')[0]}</p>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href="/mes-reservations"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#4c7650]/5 text-[#2d452e] font-medium transition-all group"
                                            >
                                                <Calendar className="w-4 h-4 text-[#4c7650]/50 group-hover:text-[#4c7650]" />
                                                <span>Mes Réservations</span>
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-all group"
                                            >
                                                <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                                <span>Déconnexion</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
