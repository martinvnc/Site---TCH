"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        gender: "M",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone: formData.phone,
                    gender: formData.gender,
                },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/"), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-brand-green px-4 py-12 selection:bg-brand-yellow/30 font-sans">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <div className="relative w-full max-w-[500px] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
                <div className="px-8 pt-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-zinc-50 rounded-3xl mb-6">
                        <Image
                            src="/logo-tch.png"
                            alt="Tennis Club Halluin Logo"
                            width={160}
                            height={70}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-brand-dark">
                        Rejoignez-nous
                    </h2>
                    <p className="mt-2 text-zinc-500 font-medium">
                        Devenez membre du Tennis Club d'Halluin
                    </p>
                </div>

                <div className="p-8 pb-10">
                    {error && (
                        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 flex items-center gap-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">✕</span>
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="rounded-[2rem] bg-green-50 p-10 text-center text-green-700 border border-green-100">
                            <div className="mb-4 text-5xl">🎾</div>
                            <h3 className="text-2xl font-black mb-2 lowercase first-letter:uppercase">Félicitations !</h3>
                            <p className="font-bold text-lg mb-4">Votre compte a été créé.</p>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-1.5 w-12 bg-green-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-600 animate-[loading_3s_ease-in-out]"></div>
                                </div>
                                <p className="text-sm opacity-70">Redirection vers l'accueil...</p>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">Prénom</label>
                                    <input
                                        name="firstName"
                                        type="text"
                                        required
                                        className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white"
                                        placeholder="Jean"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">Nom</label>
                                    <input
                                        name="lastName"
                                        type="text"
                                        required
                                        className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white"
                                        placeholder="Dupont"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">E-mail</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white"
                                    placeholder="jean.dupont@exemple.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">Mot de passe</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">Téléphone</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white"
                                        placeholder="06 12 34 56 78"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1 group-focus-within:text-brand-green">Sexe</label>
                                    <div className="relative">
                                        <select
                                            name="gender"
                                            className="w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-brand-green focus:bg-white appearance-none cursor-pointer"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="M">Homme</option>
                                            <option value="F">Femme</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative mt-4 flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-yellow text-lg font-black text-brand-dark shadow-[0_4px_0px_0px_#cc9e63] transition-all hover:translate-y-[2px] hover:shadow-[0_2px_0px_0px_#cc9e63] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
                            >
                                {loading ? (
                                    <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                ) : (
                                    "Créer mon compte"
                                )}
                            </button>

                            <p className="mt-6 text-center text-sm font-medium text-zinc-500">
                                Déjà membre ?{" "}
                                <Link href="/login" className="font-bold text-brand-green hover:underline">
                                    Se connecter
                                </Link>
                            </p>
                        </form>
                    )}
                </div>

                <div className="bg-zinc-50 py-6 text-center border-t border-zinc-100 font-sans">
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-brand-green transition-colors uppercase tracking-widest">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Retour au site
                    </Link>
                </div>
            </div>
        </div>
    );
}
