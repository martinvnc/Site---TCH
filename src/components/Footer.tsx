import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MapPin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-[#2d452e] via-[#2d452e] to-[#1a2b1c] text-white pt-6 xl:pt-10 pb-4 xl:pb-6 overflow-hidden border-t border-white/5">
            {/* Subtle Golden Decorative Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-[#F6CA73] blur-3xl" />
                <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-[#F6CA73] blur-3xl" />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0">
                    {/* Club Info */}
                    <div className="relative space-y-4 md:pr-12 lg:pr-10">
                        <Image
                            src="/Logo TCH - Blanc (footer).png"
                            alt="Tennis Club Halluin"
                            width={180}
                            height={75}
                            sizes="180px"
                            className="h-8 xl:h-12 w-auto object-contain"
                            priority
                            loading="eager"
                            quality={85}
                        />
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xs font-medium">
                            L'excellence du tennis au cœur d'Halluin. Un cadre unique pour votre passion, ouvert à tous.
                        </p>
                        {/* Vertical Divider (MD & LG) */}
                        <div className="hidden md:absolute md:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Contact - Minimal */}
                    <div className="relative md:pl-12 lg:px-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#F6CA73] mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-gradient-to-r from-[#F6CA73] to-transparent rounded-full" />
                            Contact
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                            <Link
                                href="https://www.google.com/maps/search/?api=1&query=341+Rue+de+la+Lys+59250+Halluin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group transition-all"
                            >
                                <div className="p-2 -ml-2 rounded-lg group-hover:bg-white/5 transition-colors">
                                    <MapPin className="w-5 h-5 text-white/90 group-hover:text-[#F6CA73] transition-colors flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-[#F6CA73] transition-colors">Localisation</p>
                                    <p className="text-sm text-white/60 lowercase">341 Rue de la Lys, Halluin</p>
                                </div>
                            </Link>
                            <Link
                                href="mailto:contact@tch.fr"
                                className="flex items-center gap-4 group transition-all"
                            >
                                <div className="p-2 -ml-2 rounded-lg group-hover:bg-white/5 transition-colors">
                                    <Mail className="w-5 h-5 text-white/90 group-hover:text-[#F6CA73] transition-colors flex-shrink-0" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-[#F6CA73] transition-colors">Email</p>
                                    <p className="text-sm text-white/60">contact@tch.fr</p>
                                </div>
                            </Link>
                        </div>
                        {/* Vertical Divider (Only on LG to avoid double on MD) */}
                        <div className="hidden lg:absolute lg:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Navigation - Minimal */}
                    <div className="relative md:pr-12 lg:px-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#F6CA73] mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-gradient-to-r from-[#F6CA73] to-transparent rounded-full" />
                            Explorer
                        </h3>
                        <ul className="grid grid-cols-1 gap-3">
                            {[
                                { name: "Accueil", href: "/" },
                                { name: "Le Club", href: "/club" },
                                { name: "Réservation", href: "/login" },
                                { name: "Contact", href: "/contact" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-white/90 hover:text-[#F6CA73] flex items-center gap-3 group transition-all duration-300"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[#F6CA73] group-hover:scale-125 transition-all duration-300" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {/* Vertical Divider (MD & LG) */}
                        <div className="hidden md:absolute md:block right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Stats/Horaires - Minimal */}
                    <div className="self-start md:pl-12 lg:pl-10">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#F6CA73] mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-gradient-to-r from-[#F6CA73] to-transparent rounded-full" />
                            Horaires
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3 hover:border-[#F6CA73]/30 transition-colors">
                                <span className="text-white/60 font-medium">Semaine</span>
                                <span className="font-bold text-white">9h - 22h</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60 font-medium">Weekend</span>
                                <span className="font-bold text-white">9h - 20h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar - Ultra Discreet */}
                <div className="mt-6 xl:mt-10 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-white/40 text-[10px] font-bold tracking-wider uppercase">
                        <span>&copy; {new Date().getFullYear()} Tennis Club d'Halluin</span>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/10" />
                        <Link href="/mentions-legales" className="hover:text-[#F6CA73] transition-colors">Mentions légales</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="https://www.facebook.com/tchalluinois"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-[#F6CA73] hover:scale-110 transition-all duration-300"
                        >
                            <Facebook className="w-5 h-5 fill-current" />
                        </Link>
                        <Link
                            href="https://www.instagram.com/tchalluin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-[#F6CA73] hover:scale-110 transition-all duration-300"
                        >
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
