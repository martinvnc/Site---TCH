import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-tennis.jpg"
                    alt="Tennis Club d'Halluin"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
                    Tennis Club d'Halluin
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 mb-8 font-medium drop-shadow-lg">
                    Votre passion, notre engagement
                </p>
                <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md">
                    Rejoignez un club dynamique et convivial pour pratiquer le tennis dans les meilleures conditions
                </p>

                {/* CTA Button */}
                <Link
                    href="#actualites"
                    className="inline-block px-8 py-4 bg-[#f6ca73] text-[#2d452e] text-lg font-bold rounded-2xl hover:bg-[#f6ca73]/90 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95"
                >
                    Découvrir le club
                </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg
                    className="w-6 h-6 text-white/70"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </section>
    );
}
