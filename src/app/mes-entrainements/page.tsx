"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Dumbbell, Construction } from "lucide-react";

export default function MesEntrainementsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#f8faf8] to-[#f0f5f1] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c7650]"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f8faf8] to-[#f0f5f1] pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-[#2d452e] mb-2 tracking-tight">
                        Mes Entrainements
                    </h1>
                    <p className="text-[#4c7650]/70 text-lg">
                        Suivez vos sessions et progressez dans votre pratique
                    </p>
                </div>

                {/* Carte en construction */}
                <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#2d452e]/5 overflow-hidden">
                    <div className="p-12 text-center">
                        {/* Icône de construction */}
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#F6CA73]/20 to-[#F6CA73]/5 mb-6">
                            <Construction className="w-12 h-12 text-[#F6CA73]" strokeWidth={1.5} />
                        </div>

                        <h2 className="text-3xl font-bold text-[#2d452e] mb-4">
                            Page en construction
                        </h2>

                        <p className="text-[#4c7650]/70 text-lg mb-8 max-w-md mx-auto">
                            Cette fonctionnalité sera bientôt disponible ! Vous pourrez gérer vos entrainements et suivre votre progression.
                        </p>

                        {/* Icône de tennis */}
                        <div className="flex items-center justify-center gap-4 text-[#4c7650]/30 mb-8">
                            <Dumbbell className="w-8 h-8" />
                            <span className="text-4xl">🎾</span>
                            <Dumbbell className="w-8 h-8" />
                        </div>

                        {/* Bouton retour */}
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-br from-[#4c7650] to-[#3d5f41] text-white font-medium transition-all duration-300 hover:shadow-[0_10px_30px_rgba(76,118,80,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>

                {/* Info supplémentaire */}
                <div className="mt-8 text-center">
                    <p className="text-[#4c7650]/50 text-sm">
                        Cette page sera prochainement enrichie avec des fonctionnalités de suivi d'entrainement
                    </p>
                </div>
            </div>
        </div>
    );
}
