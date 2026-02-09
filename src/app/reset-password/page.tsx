"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Lock, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si l'utilisateur a une session de récupération valide
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setHasValidSession(!!session);
        };
        checkSession();
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white px-4 py-12 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#f6ca73]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4c7650]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="w-full max-w-xl relative bg-white p-12 md:p-16 rounded-[40px] border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)]">
                {/* Back Button */}
                <Link
                    href="/login"
                    className="absolute top-8 left-8 flex items-center gap-2 text-[#4c7650] hover:text-[#2d452e] font-bold transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#4c7650]/5 flex items-center justify-center group-hover:bg-[#4c7650] group-hover:text-white transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="hidden sm:inline">Retour</span>
                </Link>

                <div className="text-center mb-10">
                    <div className="mx-auto mb-8 flex justify-center transform hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/Logo TCH - Vert.png"
                            alt="Tennis Club Halluin"
                            width={450}
                            height={160}
                            className="h-auto w-auto max-h-48 object-contain"
                        />
                    </div>

                    {hasValidSession === false ? (
                        <>
                            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                                <AlertCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-[#2d452e]">Lien invalide ou expiré</h2>
                            <p className="mt-4 text-[#4c7650] font-medium">Ce lien de réinitialisation n'est plus valide. Il a peut-être expiré ou a déjà été utilisé.</p>
                        </>
                    ) : !success ? (
                        <>
                            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-[#4c7650] to-[#3d5f41] rounded-full flex items-center justify-center shadow-lg shadow-[#4c7650]/20">
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-[#2d452e]">Nouveau mot de passe</h2>
                            <p className="mt-4 text-[#4c7650] font-medium">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
                        </>
                    ) : (
                        <>
                            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 animate-in zoom-in duration-300">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight text-[#2d452e]">Mot de passe mis à jour ! 🎉</h2>
                            <p className="mt-4 text-[#4c7650] font-medium">Votre mot de passe a été changé avec succès. Redirection vers la page de connexion...</p>
                        </>
                    )}
                </div>

                {!success && (
                    <>
                        {error && (
                            <div className="mb-8 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#2d452e]/80 ml-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full rounded-2xl border border-transparent bg-[#4c7650]/5 px-6 py-4 text-[#2d452e] placeholder:text-[#2d452e]/30 outline-none transition-all duration-300 focus:border-[#4c7650] focus:bg-white focus:ring-4 focus:ring-[#4c7650]/5"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <p className="text-xs text-[#4c7650]/60 ml-1">Au moins 6 caractères</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#2d452e]/80 ml-1">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full rounded-2xl border border-transparent bg-[#4c7650]/5 px-6 py-4 text-[#2d452e] placeholder:text-[#2d452e]/30 outline-none transition-all duration-300 focus:border-[#4c7650] focus:bg-white focus:ring-4 focus:ring-[#4c7650]/5"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#4c7650] text-xl font-bold text-white shadow-lg shadow-[#4c7650]/20 transition-all duration-300 hover:bg-[#2d452e] hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden mt-8"
                            >
                                {loading ? (
                                    <svg className="h-7 w-7 animate-spin text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Réinitialiser le mot de passe
                                        <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {success && (
                    <div className="mt-8">
                        <Link
                            href="/login"
                            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#4c7650] text-lg font-bold text-white transition-all duration-300 hover:bg-[#2d452e] hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Aller à la connexion
                        </Link>
                    </div>
                )}

                {hasValidSession === false && (
                    <div className="mt-8">
                        <Link
                            href="/forgot-password"
                            className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#4c7650] text-lg font-bold text-white transition-all duration-300 hover:bg-[#2d452e] hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Redemander un nouveau lien
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
