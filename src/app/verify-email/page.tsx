"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResendEmail = async () => {
        if (!email) return;

        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        setResending(false);

        if (!error) {
            setResent(true);
            setTimeout(() => setResent(false), 5000);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="w-full max-w-md text-center bg-white p-12 rounded-[40px] border border-[#4c7650]/10 shadow-[0_20px_50px_rgba(76,118,80,0.08)]">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Image
                        src="/Logo TCH - Vert.png"
                        alt="Tennis Club Halluin"
                        width={300}
                        height={100}
                        className="h-auto w-auto max-h-24 object-contain"
                    />
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-[#4c7650] rounded-full flex items-center justify-center">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                </div>

                {/* Title & Message */}
                <h1 className="text-3xl font-black text-[#2d452e] mb-4">
                    Vérifiez votre email
                </h1>
                <p className="text-[#4c7650]/70 font-medium mb-6">
                    Nous avons envoyé un email de confirmation à :
                </p>

                {/* Email Display */}
                <div className="mb-8 bg-[#4c7650]/5 px-6 py-3 rounded-2xl border border-[#4c7650]/10">
                    <p className="text-[#2d452e] font-bold">{email}</p>
                </div>

                {/* Success Message */}
                {resent && (
                    <div className="mb-6 rounded-2xl bg-green-50 p-4 text-sm font-bold text-green-600 border border-green-100 animate-in fade-in duration-300">
                        Email renvoyé avec succès !
                    </div>
                )}

                {/* Resend Button */}
                <button
                    onClick={handleResendEmail}
                    disabled={resending || !email}
                    className="w-full mb-4 py-4 bg-[#4c7650] text-white rounded-[24px] font-bold hover:bg-[#2d452e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {resending ? (
                        <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Envoi en cours...
                        </div>
                    ) : (
                        'Renvoyer l\'email'
                    )}
                </button>

                {/* Back to Login */}
                <Link
                    href="/login"
                    className="text-[#4c7650] font-bold hover:text-[#2d452e] transition-colors text-sm"
                >
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
}
