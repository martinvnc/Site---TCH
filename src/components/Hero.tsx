import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-[#2d452e]">
            {/* Background Image optimisée avec Next.js - Style Club Page */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2d452e]" />
                <Image
                    src="/hero-tch-indoor.jpg"
                    alt="Tennis Club Halluin"
                    fill
                    priority
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    className="object-cover opacity-50 grayscale-[20%]"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
            </div>

            {/* Content centered - Improved visual centering */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-14 w-full h-full">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    Les Actualités
                </h1>
                <p className="mt-4 text-lg sm:text-xl md:text-2xl font-normal text-[#F6CA73] tracking-[0.2em] uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                    du Tennis Club d'Halluin
                </p>
            </div>
        </section>
    );
}
