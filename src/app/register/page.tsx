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
        <div className="flex min-h-screen items-center justify-center bg-[#638d66] px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex justify-center">
                        <Image
                            src="/logo-tch.png"
                            alt="Tennis Club Halluin Logo"
                            width={180}
                            height={80}
                            className="h-auto w-auto max-h-24 object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900">Créer un compte</h2>
                    <p className="mt-2 text-zinc-500">Rejoignez le Tennis Club d'Halluin</p>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 italic">
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="rounded-xl bg-green-50 p-6 text-center text-green-700 border border-green-100">
                        <div className="mb-2 text-3xl">🎉</div>
                        <p className="font-bold">Inscription réussie !</p>
                        <p className="mt-1 text-sm">Vérifiez vos e-mails pour confirmer votre compte. Redirection en cours...</p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Prénom</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white"
                                    placeholder="Jean"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Nom</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white"
                                    placeholder="Dupont"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Adresse email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white"
                                placeholder="jean.dupont@exemple.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Mot de passe</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Téléphone</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white"
                                    placeholder="06 12 34 56 78"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1 ml-1">Sexe</label>
                                <select
                                    name="gender"
                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition-all focus:border-yellow-400 focus:bg-white appearance-none"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="M">Homme</option>
                                    <option value="F">Femme</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-14 w-full items-center justify-center rounded-2xl bg-yellow-400 text-lg font-bold text-black shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <svg className="h-6 w-6 animate-spin text-black" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                "S'inscrire"
                            )}
                        </button>

                        <p className="text-center text-sm text-zinc-500">
                            Déjà un compte ?{" "}
                            <Link href="/login" className="font-bold text-zinc-900 hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
