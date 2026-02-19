import Link from "next/link";
import { Hammer } from "lucide-react";

export default function ActualitesPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#4c7650]/10 flex items-center justify-center mb-8">
                <Hammer className="w-10 h-10 text-[#4c7650]" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-[#2d452e] mb-3">En construction</h1>
            <p className="text-gray-400 font-medium max-w-xs leading-relaxed mb-10">
                La page des actualités du club est en cours de développement. Revenez bientôt !
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d452e] text-white font-bold rounded-xl hover:bg-[#4c7650] transition-colors"
            >
                ← Retour à l'accueil
            </Link>
        </div>
    );
}
