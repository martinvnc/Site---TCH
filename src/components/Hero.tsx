import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[50vh] min-h-[400px] sm:h-[60vh] sm:min-h-[500px] lg:h-[75vh] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Simplified Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="/hero-tch-indoor.jpg"
                    alt="Tennis Club d'Halluin"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Content centered with vertical offset */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 transform translate-y-4 sm:translate-y-8 lg:translate-y-12 gap-4 sm:gap-6 lg:gap-8">
                <div className="animate-fade-in-down">
                    <Image
                        src="/Logo TCH - Blanc.png"
                        alt="Logo Tennis Club Halluin"
                        width={700}
                        height={300}
                        className="w-auto h-32 sm:h-48 md:h-64 lg:h-80 xl:h-[450px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
                        priority
                    />
                </div>

                {/* Green CTA Button - Responsive */}
                <Link
                    href="/club"
                    className="inline-block px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 bg-[#4c7650] text-white text-base sm:text-lg lg:text-xl font-bold rounded-xl lg:rounded-2xl hover:bg-[#3a5a3d] transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 animate-fade-in-up"
                >
                    Découvrir le club
                </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white/70"
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
