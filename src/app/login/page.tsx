"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
            router.push("/test");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#4c7650] px-4 py-12">
            <div className="w-full max-w-xl space-y-8 rounded-3xl bg-white px-16 py-14 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex justify-center">
                        <Image
                            src="/Logo TCH - Vert.png"
                            alt="Tennis Club Halluin Logo"
                            width={500}
                            height={200}
                            className="h-auto w-auto max-h-44 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900">Connexion</h2>
                    <p className="mt-2 text-zinc-500 font-normal">Heureux de vous revoir !</p>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Adresse email</label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-[#f6ca73] focus:bg-white focus:ring-2 focus:ring-[#f6ca73]/20"
                                placeholder="jean.dupont@exemple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1 ml-1">
                                <label className="block text-sm font-bold text-zinc-700">Mot de passe</label>
                                <Link href="#" className="text-sm font-bold text-[#4c7650] hover:text-[#639268] transition-colors">
                                    Oublié ?
                                </Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-[#f6ca73] focus:bg-white focus:ring-2 focus:ring-[#f6ca73]/20"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#4c7650] text-lg font-bold text-white shadow-lg transition-all hover:bg-[#639268] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            "Se connecter"
                        )}
                    </button>

                    <p className="text-center text-sm text-zinc-500 font-normal">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="font-bold text-[#4c7650] hover:text-[#639268] transition-colors">
                            S'inscrire
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
