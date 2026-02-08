"use client";

import { useEffect, useState } from "react";

interface TimeRemainingProps {
    expiresAt: string;
    className?: string;
}

export default function TimeRemaining({ expiresAt, className = "" }: TimeRemainingProps) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isExpired, setIsExpired] = useState<boolean>(false);

    useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const expires = new Date(expiresAt);
            const diff = expires.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Expirée');
                setIsExpired(true);
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${seconds}s`);
            }
            setIsExpired(false);
        };

        // Update immediately
        updateTimeLeft();

        // Update every second
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-[#f6ca73]/20 to-[#e5b962]/20 border border-[#f6ca73]/40 rounded-lg ${className}`}>
            <div className={`relative ${!isExpired && 'animate-pulse'}`}>
                <svg className={`w-3 h-3 ${isExpired ? 'text-red-500' : 'text-[#f6ca73]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span className={`font-mono text-[10px] font-black uppercase tracking-wide ${isExpired ? 'text-red-600' : 'text-[#2d452e]'}`}>
                {timeLeft}
            </span>
        </div>
    );
}
