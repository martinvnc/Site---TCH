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
        <span className={`font-mono text-xs font-bold ${isExpired ? 'text-red-500' : 'text-orange-600'} ${className}`}>
            {timeLeft}
        </span>
    );
}
