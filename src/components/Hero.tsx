import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[65vh] min-h-[500px] sm:h-[70vh] lg:h-[80vh] flex items-center justify-center overflow-hidden bg-[#2d452e]">
            {/* Background Image optimisée avec Next.js */}
            <Image
                src="/hero-indoor-new.jpeg"
                alt="Tennis Club Halluin Indoor"
                fill
                priority
                quality={85}
                sizes="100vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content centered */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 gap-8 sm:gap-10 lg:gap-12">
                <div className="flex flex-col items-center">
                    <Image
                        src="/Logo TCH - Blanc.png"
                        alt="Logo Tennis Club Halluin"
                        width={700}
                        height={300}
                        sizes="(max-width: 640px) 150px, (max-width: 1024px) 220px, 350px"
                        className="w-auto h-16 sm:h-20 md:h-28 lg:h-32 xl:h-[200px] object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                        priority
                        quality={90}
                    />
                </div>

                {/* Green CTA Button - Compact & Balanced */}
                <Link
                    href="/club"
                    className="inline-block px-7 py-3 sm:px-9 sm:py-3.5 bg-[#4c7650] text-white text-xs sm:text-sm lg:text-base font-bold rounded-xl lg:rounded-2xl hover:bg-[#3a5a3d] transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 animate-fade-in-up"
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
