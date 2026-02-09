import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[45vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-[#2d452e]">
            {/* Background Image optimisée avec Next.js - Style Club Page */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#2d452e]" />
                <Image
                    src="/hero-indoor-new.jpeg"
                    alt="Tennis Club Halluin"
                    fill
                    priority
                    quality={85}
                    sizes="100vw"
                    className="object-cover opacity-50 grayscale-[20%]"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
            </div>

            {/* Content centered - Centered Logo as in Club style */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 animate-fade-in-up">
                <div className="flex flex-col items-center">
                    <Image
                        src="/Logo TCH - Blanc.png"
                        alt="Logo Tennis Club Halluin"
                        width={240}
                        height={120}
                        sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 450px"
                        className="w-auto h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)] translate-y-4 -translate-x-1"
                        priority
                        quality={90}
                    />
                </div>
            </div>
        </section>
    );
}
