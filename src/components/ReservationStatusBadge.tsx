"use client";

import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type ReservationStatus = 'pending' | 'confirmed' | 'expired';

interface ReservationStatusBadgeProps {
    status: ReservationStatus;
    expiresAt?: string;
    className?: string;
}

export default function ReservationStatusBadge({ status, expiresAt, className = "" }: ReservationStatusBadgeProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'confirmed':
                return {
                    label: 'Confirmée',
                    icon: <CheckCircle2 className="w-4 h-4" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    iconColor: 'text-green-500'
                };
            case 'pending':
                return {
                    label: 'En attente',
                    icon: <Clock className="w-4 h-4 animate-pulse" />,
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-700',
                    iconColor: 'text-orange-500'
                };
            case 'expired':
                return {
                    label: 'Expirée',
                    icon: <XCircle className="w-4 h-4" />,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-500',
                    iconColor: 'text-gray-400'
                };
            default:
                return {
                    label: 'Inconnu',
                    icon: <AlertCircle className="w-4 h-4" />,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-500',
                    iconColor: 'text-gray-400'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 ${config.bgColor} ${config.borderColor} ${className}`}>
            <span className={config.iconColor}>{config.icon}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
                {config.label}
            </span>
        </div>
    );
}
