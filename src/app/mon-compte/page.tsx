"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, Calendar, Shield, Save, Loader2 } from "lucide-react";

export default function MonComptePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Non disponible";
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#f8faf8] to-[#f0f5f1] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4c7650] animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f8faf8] to-[#f0f5f1] pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-[#2d452e] mb-2 tracking-tight">
                        Mon Compte
                    </h1>
                    <p className="text-[#4c7650]/70 text-lg">
                        Gérez vos informations personnelles et vos préférences
                    </p>
                </div>

                {/* Message de notification */}
                {message && (
                    <div className={`mb-6 p-4 rounded-2xl border ${message.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        } animate-in fade-in slide-in-from-top-2 duration-300`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-[#2d452e]/5 overflow-hidden">
                    {/* Header avec avatar */}
                    <div className="bg-gradient-to-br from-[#4c7650] to-[#3d5f41] p-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                                <UserIcon className="w-12 h-12 text-white" />
                            </div>
                            <div className="flex-1 text-white">
                                <h2 className="text-3xl font-bold mb-1">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </h2>
                                <p className="text-white/80 text-sm">Membre du Tennis Club Halluin</p>
                            </div>
                        </div>
                    </div>

                    {/* Informations du compte */}
                    <div className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-[#4c7650]/60 uppercase tracking-wider mb-3">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <div className="bg-gradient-to-br from-[#4c7650]/5 to-transparent rounded-xl p-4 border border-[#2d452e]/5">
                                    <p className="text-[#2d452e] font-medium">{user.email}</p>
                                </div>
                            </div>

                            {/* Date de création */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-bold text-[#4c7650]/60 uppercase tracking-wider mb-3">
                                    <Calendar className="w-4 h-4" />
                                    Membre depuis
                                </label>
                                <div className="bg-gradient-to-br from-[#4c7650]/5 to-transparent rounded-xl p-4 border border-[#2d452e]/5">
                                    <p className="text-[#2d452e] font-medium">{formatDate(user.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Statut du compte */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-[#4c7650]/60 uppercase tracking-wider mb-3">
                                <Shield className="w-4 h-4" />
                                Statut du compte
                            </label>
                            <div className="bg-gradient-to-br from-[#4c7650]/5 to-transparent rounded-xl p-4 border border-[#2d452e]/5">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.email_confirmed_at
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                                        }`}>
                                        {user.email_confirmed_at ? '✓ Email vérifié' : '⚠ Email non vérifié'}
                                    </span>
                                    <span className="text-[#2d452e]/60 text-sm">
                                        {user.email_confirmed_at
                                            ? `Vérifié le ${formatDate(user.email_confirmed_at)}`
                                            : 'Vérifiez votre email pour activer toutes les fonctionnalités'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ID Utilisateur (pour debug/support) */}
                        <div className="group">
                            <label className="text-sm font-bold text-[#4c7650]/40 uppercase tracking-wider mb-3 block">
                                ID Utilisateur
                            </label>
                            <div className="bg-[#2d452e]/3 rounded-xl p-3 border border-[#2d452e]/5">
                                <p className="text-[#2d452e]/50 font-mono text-xs break-all">{user.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="p-8 pt-0">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push('/mes-reservations')}
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-br from-[#4c7650] to-[#3d5f41] text-white font-medium transition-all duration-300 hover:shadow-[0_10px_30px_rgba(76,118,80,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Calendar className="w-5 h-5" />
                                Mes Réservations
                            </button>
                            <button
                                onClick={() => router.push('/reservation')}
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-[#4c7650] text-[#4c7650] font-medium transition-all duration-300 hover:bg-[#4c7650]/5 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Calendar className="w-5 h-5" />
                                Nouvelle Réservation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
