import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MapPin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-[#2d452e] via-[#2d452e] to-[#1a2b1c] text-white pt-16 pb-8 overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
                    {/* Club Info */}
                    <div className="relative space-y-6 md:pr-12 lg:pr-10">
                        <Image
                            src="/Logo TCH - Blanc (footer).png"
                            alt="Tennis Club Halluin"
                            width={180}
                            height={75}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                        <p className="text-white text-sm leading-relaxed max-w-xs">
                            L'excellence du tennis au cœur d'Halluin. Un cadre unique pour votre passion, ouvert à tous.
                        </p>
                        {/* Vertical Divider (MD & LG) */}
                        <div className="hidden md:absolute md:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-white/10" />
                    </div>

                    {/* Contact - Minimal */}
                    <div className="relative md:pl-12 lg:px-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Contact</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 cursor-default group">
                                <div className="p-2 -ml-2 rounded-lg group-hover:bg-white/5 transition-colors">
                                    <MapPin className="w-5 h-5 text-white flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Localisation</p>
                                    <p className="text-sm text-white/70 lowercase">Rue du Tennis, Halluin</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 cursor-default group">
                                <div className="p-2 -ml-2 rounded-lg group-hover:bg-white/5 transition-colors">
                                    <Mail className="w-5 h-5 text-white flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Email</p>
                                    <p className="text-sm text-white/70">contact@tch-tennis.fr</p>
                                </div>
                            </div>
                        </div>
                        {/* Vertical Divider (Only on LG to avoid double on MD) */}
                        <div className="hidden lg:absolute lg:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-white/10" />
                    </div>

                    {/* Navigation - Minimal */}
                    <div className="relative md:pr-12 lg:px-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Explorer</h3>
                        <ul className="grid grid-cols-1 gap-4">
                            {[
                                { name: "Accueil", href: "/" },
                                { name: "Le Club", href: "/club" },
                                { name: "Réservation", href: "/login" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-white hover:text-white/70 flex items-center gap-3 group transition-all duration-300"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* Vertical Divider (MD & LG) */}
                        <div className="hidden md:absolute md:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-white/10" />
                    </div>

                    {/* Stats/Horaires - Minimal */}
                    <div className="self-start md:pl-12 lg:pl-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-8">Horaires</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                <span className="text-white/70">Semaine</span>
                                <span className="font-bold text-white">9h - 22h</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/70">Weekend</span>
                                <span className="font-bold text-white">8h - 20h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Ultra Discreet */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-white/50 text-[10px] font-medium tracking-wider uppercase">
                        <span>&copy; {new Date().getFullYear()} Tennis Club d'Halluin</span>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
                        <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="https://facebook.com/TCHalluin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white hover:scale-110 transition-all duration-300"
                        >
                            <Facebook className="w-5 h-5 fill-current" />
                        </Link>
                        <Link
                            href="https://instagram.com/tch_tennis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white hover:scale-110 transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
