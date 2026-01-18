import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 selection:bg-yellow-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/logo-tch.png"
            alt="Logo TCH"
            width={80}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold tracking-tight text-[#638d66]">Tennis Club Halluin</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex text-zinc-600">
          <Link href="/" className="font-semibold transition-colors hover:text-[#638d66]">Accueil</Link>
          <Link href="/reserver" className="font-semibold transition-colors hover:text-[#638d66]">Réserver</Link>
          <Link href="/club" className="font-semibold transition-colors hover:text-[#638d66]">Le Club</Link>
          <Link href="/contact" className="font-semibold transition-colors hover:text-[#638d66]">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="rounded-full px-6 py-2.5 font-semibold transition-all hover:bg-zinc-100">
            Connexion
          </Link>
          <Link href="/register" className="rounded-full bg-zinc-900 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-95">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden bg-zinc-900">
          <Image
            src="/tch_hero_tennis.png"
            alt="Tennis Court"
            fill
            className="object-cover opacity-60 brightness-75"
            priority
          />
          <div className="relative z-10 max-w-4xl px-8 text-center text-white">
            <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
              JOUEZ AU MEILLEUR <span className="text-yellow-400 underline decoration-yellow-400 underline-offset-8">NIVEAU</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-200 sm:text-xl">
              Rejoignez le Tennis Club d'Halluin et profitez de nos installations modernes,
              de nos cours pour tous les niveaux et d'une ambiance conviviale.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/reserver"
                className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-8 text-lg font-bold text-black transition-all hover:bg-yellow-300 sm:w-auto"
              >
                Réserver un court
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/club"
                className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-white/20 px-8 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 sm:w-auto"
              >
                Découvrir le club
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-black tracking-tight text-zinc-900">Pourquoi nous choisir ?</h2>
              <div className="mx-auto h-1.5 w-20 rounded-full bg-yellow-400"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                { title: "Installations Premium", desc: "4 courts couverts et 2 courts extérieurs entretenus quotidiennement.", icon: "🎾" },
                { title: "Coaching Pro", desc: "Des moniteurs diplômés d'État pour vous faire progresser quel que soit votre niveau.", icon: "🏆" },
                { title: "Vie du Club", desc: "Tournois, animations et soirées tout au long de l'année pour tous les membres.", icon: "🤝" }
              ].map((feature, i) => (
                <div key={i} className="group rounded-3xl bg-white p-10 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl border border-zinc-100">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 text-4xl transition-colors group-hover:bg-yellow-400/10">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                  <p className="text-lg leading-relaxed text-zinc-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-12 px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <div className="mb-4 flex items-center gap-4">
              <Image
                src="/logo-tch.png"
                alt="Logo TCH"
                width={60}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-lg font-bold tracking-tight text-[#638d66]">Tennis Club Halluin</span>
            </div>
            <p className="max-w-xs text-zinc-500">
              Le club de tennis de référence à Halluin. Passion, progrès et convivialité depuis 1970.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Contact</h4>
            <address className="not-italic text-zinc-500">
              Rue du Tennis<br />
              59250 Halluin<br />
              03 20 00 00 00
            </address>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Suivez-nous</h4>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer hover:bg-zinc-200">FB</div>
              <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center cursor-pointer hover:bg-zinc-200">IG</div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-100 pt-8 text-center text-sm text-zinc-400">
          © {new Date().getFullYear()} Tennis Club d'Halluin. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
