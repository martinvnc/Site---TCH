"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Calendar, Menu, X } from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error("Session retrieval error:", error);
                // If there's an issue with the refresh token, sign out to clear stale data
                if (error.message?.includes("refresh_token_not_found") ||
                    error.message?.includes("refresh token") ||
                    error.status === 400) {
                    supabase.auth.signOut().then(() => {
                        setUser(null);
                        // Optional: trigger a refresh or redirect if on a protected page
                    });
                } else {
                    setUser(null);
                }
            } else {
                setUser(session?.user ?? null);
            }
        }).catch((err) => {
            console.error("Unexpected session error:", err);
            // In case of any serious error, try to sign out to recover
            supabase.auth.signOut().finally(() => {
                setUser(null);
            });
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] border-b py-1 xl:py-1.5 ${scrolled
                ? "bg-white/98 backdrop-blur-xl shadow-[0_10px_30px_rgba(45,69,46,0.08)] border-[#4c7650]/10"
                : "bg-white/95 backdrop-blur-md border-[#4c7650]/5"
                }`}
        >
            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                <div className="flex items-center justify-between h-12 xl:h-14">
                    {/* Groupe Gauche : Logo + Nav */}
                    <div className="flex items-center gap-4 xl:gap-12">
                        <Link
                            href="/"
                            className="flex items-center group shrink-0"
                        >
                            <Image
                                src="/Logo TCH - Vert (header).png"
                                alt="Tennis Club Halluin"
                                width={180}
                                height={75}
                                className="w-auto h-7 xl:h-9 object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>

                        {/* Menu navigation épuré */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {[
                                { name: "Accueil", href: "/" },
                                { name: "Le Club", href: "/club" },
                                { name: "Réservation", href: user ? "/reservation" : "/login" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative px-2 xl:px-4 py-1.5 text-sm font-medium tracking-wide transition-all duration-300 group ${isActive ? "text-[#4c7650]" : "text-[#2d452e] hover:text-[#4c7650]"
                                            }`}
                                    >
                                        <span className="relative z-10">{item.name}</span>
                                        <span className={`absolute bottom-1 left-5 right-5 h-[1.5px] bg-[#F6CA73] transition-transform duration-500 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                            }`} />
                                    </Link>
                                );
                            })}
                        </nav>

                    </div>

                    {/* Navigation buttons à droite */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {!user ? (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden sm:flex items-center justify-center px-4 py-1.5 text-sm font-medium text-[#4c7650] border border-[#4c7650]/40 rounded-full transition-all duration-300 hover:border-[#4c7650] hover:bg-[#4c7650]/5 hover:scale-105 active:scale-95"
                                >
                                    Se connecter
                                </Link>

                                <Link
                                    href="/register"
                                    className="relative flex items-center justify-center px-3 xl:px-5 py-2 rounded-full bg-[#4c7650] text-sm font-medium text-white transition-all duration-500 hover:bg-[#3d5f41] hover:shadow-[0_10px_25px_rgba(76,118,80,0.2)] hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
                                >
                                    <span className="relative z-10">S'inscrire</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Bouton Mes entrainements */}
                                <Link
                                    href="/mes-entrainements"
                                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#4c7650]/30 text-[#4c7650] text-sm font-medium transition-all duration-300 hover:border-[#4c7650] hover:bg-[#4c7650]/5 hover:shadow-[0_5px_15px_rgba(76,118,80,0.15)] hover:scale-105 active:scale-95"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <ellipse cx="12" cy="8" rx="6" ry="7" />
                                        <line x1="12" y1="1" x2="12" y2="15" />
                                        <line x1="6" y1="8" x2="18" y2="8" />
                                        <line x1="9" y1="4" x2="9" y2="12" opacity="0.5" />
                                        <line x1="15" y1="4" x2="15" y2="12" opacity="0.5" />
                                        <path d="M10 15 L10 23 L14 23 L14 15" />
                                        <rect x="10" y="22" width="4" height="1.5" rx="0.5" />
                                    </svg>
                                    <span>Mes entrainements</span>
                                </Link>

                                {/* Menu utilisateur */}
                                <div className="relative user-menu">
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 overflow-hidden group bg-gradient-to-br from-[#4c7650] to-[#3d5f41] text-white hover:shadow-[0_8px_20px_rgba(76,118,80,0.3)] hover:scale-105 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <UserIcon className="relative z-10 w-5 h-5" />
                                    </button>

                                    {menuOpen && (
                                        <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-[24px] border border-[#2d452e]/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                                            <div className="p-5 bg-gradient-to-br from-[#4c7650]/5 to-transparent border-b border-[#2d452e]/5 leading-tight">
                                                <p className="text-[10px] font-bold text-[#4c7650]/40 uppercase tracking-widest mb-1">Session active</p>
                                                <p className="text-[#2d452e] font-bold truncate">{user.email?.split('@')[0]}</p>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    href="/mon-compte"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#4c7650]/5 text-[#2d452e] font-medium transition-all group"
                                                >
                                                    <UserIcon className="w-4 h-4 text-[#4c7650]/50 group-hover:text-[#4c7650]" />
                                                    <span>Mon Compte</span>
                                                </Link>

                                                <Link
                                                    href="/mes-reservations"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#4c7650]/5 text-[#2d452e] font-medium transition-all group"
                                                >
                                                    <Calendar className="w-4 h-4 text-[#4c7650]/50 group-hover:text-[#4c7650]" />
                                                    <span>Mes Réservations</span>
                                                </Link>

                                                <div className="my-2 h-px bg-[#2d452e]/5" />

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
                            </>
                        )}

                        {/* Hamburger Menu Button - visible on mobile/tablet */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#4c7650]/5 text-[#4c7650] hover:bg-[#4c7650] hover:text-white transition-all duration-300 border border-[#4c7650]/10 z-50 ml-2"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - adapted to new structure */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="absolute top-[72px] left-0 right-0 bg-white border-b border-[#4c7650]/10 shadow-2xl animate-in slide-in-from-top duration-300">
                        <nav className="container mx-auto px-4 sm:px-6 py-6">
                            <div className="space-y-2 mb-6">
                                {[
                                    { name: "Accueil", href: "/" },
                                    { name: "Le Club", href: "/club" },
                                    { name: "Réservation", href: user ? "/reservation" : "/login" },
                                    { name: "Contact", href: "/contact" },
                                ].map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`block px-4 py-3 text-base font-bold rounded-xl transition-all ${isActive
                                                ? "bg-[#4c7650]/5 text-[#4c7650]"
                                                : "text-[#2d452e] hover:bg-[#4c7650]/5 hover:text-[#4c7650]"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            {!user ? (
                                <div className="space-y-3 pt-4 border-t border-[#4c7650]/10">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full px-5 py-3 text-center text-base font-bold text-[#4c7650] border-2 border-[#4c7650]/20 rounded-xl hover:border-[#4c7650] hover:bg-[#4c7650]/5 transition-all"
                                    >
                                        Se connecter
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full px-5 py-3 text-center text-base font-bold text-white bg-[#4c7650] rounded-xl hover:bg-[#3a5a3d] transition-all shadow-md"
                                    >
                                        S'inscrire
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2 pt-4 border-t border-[#4c7650]/10">
                                    <div className="px-4 py-3 bg-[#4c7650]/5 rounded-xl mb-3">
                                        <p className="text-xs font-bold text-[#4c7650] uppercase tracking-wider mb-1">Mon Compte</p>
                                        <p className="text-sm text-[#2d452e] font-bold truncate">{user.email}</p>
                                    </div>

                                    <Link
                                        href="/mes-reservations"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-[#2d452e] hover:bg-[#4c7650]/5 rounded-xl transition-all"
                                    >
                                        <Calendar className="w-5 h-5 text-[#4c7650]" />
                                        <span>Mes Réservations</span>
                                    </Link>

                                    <Link
                                        href="/mes-entrainements"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-[#2d452e] hover:bg-[#4c7650]/5 rounded-xl transition-all"
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-[#4c7650]">🎾</span>
                                        <span>Mes Entrainements</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Déconnexion</span>
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
