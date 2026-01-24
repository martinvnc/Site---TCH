"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
        } else {
            router.push("/reservation");
            router.refresh();
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
                    href="/"
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
                    <h2 className="text-4xl font-extrabold tracking-tight text-[#2d452e]">Connexion</h2>
                </div>

                {error && (
                    <div className="mb-8 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                <form className="space-y-8" onSubmit={handleLogin}>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#2d452e]/80 ml-1">Adresse email</label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-2xl border border-transparent bg-[#4c7650]/5 px-6 py-4 text-[#2d452e] placeholder:text-[#2d452e]/30 outline-none transition-all duration-300 focus:border-[#4c7650] focus:bg-white focus:ring-4 focus:ring-[#4c7650]/5"
                                placeholder="jean.dupont@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-sm font-bold text-[#2d452e]/80">Mot de passe</label>
                                <Link href="#" className="text-sm font-bold text-[#4c7650] hover:text-[#2d452e] transition-colors leading-none">
                                    Oublié ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full rounded-2xl border border-transparent bg-[#4c7650]/5 px-6 py-4 text-[#2d452e] placeholder:text-[#2d452e]/30 outline-none transition-all duration-300 focus:border-[#4c7650] focus:bg-white focus:ring-4 focus:ring-[#4c7650]/5"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-16 w-full items-center justify-center rounded-2xl bg-[#4c7650] text-xl font-bold text-white shadow-lg shadow-[#4c7650]/20 transition-all duration-300 hover:bg-[#2d452e] hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
                    >
                        {loading ? (
                            <svg className="h-7 w-7 animate-spin text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <span className="flex items-center gap-2">
                                Se connecter
                                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        )}
                    </button>

                    <p className="text-center text-md text-[#2d452e]/60 font-medium">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="font-bold text-[#4c7650] hover:text-[#2d452e] transition-colors underline underline-offset-4 decoration-[#4c7650]/30 hover:decoration-[#2d452e]">
                            S'inscrire
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
