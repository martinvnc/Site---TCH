"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

interface ConfirmationButtonProps {
    reservationId: string;
    onConfirm: (reservationId: string) => Promise<void>;
    disabled?: boolean;
    className?: string;
}

export default function ConfirmationButton({
    reservationId,
    onConfirm,
    disabled = false,
    className = ""
}: ConfirmationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            await onConfirm(reservationId);
        } catch (error) {
            console.error('Confirmation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-[#4c7650] text-white rounded-xl font-bold text-sm hover:bg-[#2d452e] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${className}`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirmation...</span>
                </>
            ) : (
                <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmer</span>
                </>
            )}
        </button>
    );
}
