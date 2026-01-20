export default function NewsSection() {
    const news = [
        {
            id: 1,
            title: "Tournoi d'été 2026",
            date: "15 Janvier 2026",
            description: "Inscription ouverte pour le grand tournoi annuel. Catégories jeunes et adultes disponibles.",
            image: "🎾",
        },
        {
            id: 2,
            title: "Nouveaux horaires",
            date: "10 Janvier 2026",
            description: "Découvrez les nouveaux créneaux d'entraînement pour la saison printemps-été.",
            image: "🕐",
        },
        {
            id: 3,
            title: "Stage vacances",
            date: "5 Janvier 2026",
            description: "Stage intensif pour les jeunes pendant les vacances de février. Places limitées !",
            image: "🏆",
        },
    ];

    return (
        <section id="actualites" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-[#2d452e] mb-4">
                        Dernières informations
                    </h2>
                    <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
                        Restez informé des actualités, événements et nouveautés du club
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {news.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group hover:-translate-y-1"
                        >
                            <div className="h-48 bg-gradient-to-br from-[#4c7650] to-[#639268] flex items-center justify-center text-7xl">
                                {item.image}
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-[#639268] font-semibold mb-2">
                                    {item.date}
                                </p>
                                <h3 className="text-xl font-bold text-[#2d452e] mb-3 group-hover:text-[#4c7650] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
