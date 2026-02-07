import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#2d452e]">
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
            <div className="absolute inset-0 bg-black/25" />

            {/* Content centered with vertical offset */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 transform translate-y-8 gap-8">
                <div>
                    <Image
                        src="/Logo TCH - Blanc.png"
                        alt="Logo Tennis Club Halluin"
                        width={700}
                        height={300}
                        sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 450px"
                        className="w-auto h-64 sm:h-80 lg:h-[450px] object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
                        priority
                        quality={90}
                    />
                </div>

                {/* New Green CTA Button */}
                <Link
                    href="/club"
                    className="inline-block px-10 py-5 bg-[#4c7650] text-white text-xl font-bold rounded-2xl hover:bg-[#3a5a3d] transition-all shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95"
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
