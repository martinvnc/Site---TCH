"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, ChevronRight, ChevronLeft, X, Calendar, Plus, Info } from "lucide-react";
import ReservationStatusBadge from "@/components/ReservationStatusBadge";
import TimeRemaining from "@/components/TimeRemaining";
import ConfirmationButton from "@/components/ConfirmationButton";
import AdminBulkReservations from "@/components/AdminBulkReservations";
import { isAdmin } from "@/lib/roles";

// Courts data
const COURTS = [
    { id: 1, name: "Court 1", type: "Indoor", surface: "Dur" },
    { id: 2, name: "Court 2", type: "Indoor", surface: "Résine" },
    { id: 3, name: "Court 3", type: "Indoor", surface: "Résine" },
    { id: 4, name: "Court 4", type: "Outdoor", surface: "Béton Poreux" },
    { id: 5, name: "Court 5", type: "Outdoor", surface: "Béton Poreux" },
    { id: 6, name: "Court 6", type: "Outdoor", surface: "Béton Poreux" },
];

// Time slots from 08h00 to 22h00
const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
    const hour = (i + 8).toString().padStart(2, '0');
    return `${hour}:00`;
});

type Reservation = {
    id: string;
    user_id: string;
    court_id: number;
    date: string;
    start_time: string;
    user_name: string;
    status: 'pending' | 'confirmed' | 'expired';
    confirmed_by?: string;
    confirmed_by_name?: string;
    confirmed_at?: string;
    expires_at?: string;
    reservation_type?: 'normal' | 'cours' | 'match' | 'interclub' | 'admin';
    description?: string;
    created_by_admin?: boolean;
};

export default function ReservationPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<{ court: string, courtId: number, time: string } | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);
                // Check if user is admin
                const adminStatus = await isAdmin(session.user.id);
                setIsUserAdmin(adminStatus);
                setLoading(false);
            }
        });
    }, [router]);

    // Fetch reservations when date changes
    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [selectedDate, user]);

    // Auto-refresh reservations every 5 seconds + Realtime subscription
    useEffect(() => {
        if (!user) return;

        // Polling every 5 seconds
        const interval = setInterval(() => {
            fetchReservations();
        }, 5000);

        // Supabase Realtime subscription
        const dateString = selectedDate.toISOString().split('T')[0];
        const channel = supabase
            .channel('reservations-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reservations',
                    filter: `date=eq.${dateString}`
                },
                () => {
                    console.log('Reservation change detected, refreshing...');
                    fetchReservations();
                }
            )
            .subscribe();

        return () => {
            clearInterval(interval);
            supabase.removeChannel(channel);
        };
    }, [user, selectedDate]);

    const fetchReservations = async () => {
        const dateString = selectedDate.toISOString().split('T')[0];
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('date', dateString)
            .neq('status', 'expired');

        if (error) {
            console.error('Error fetching reservations:', error);
        } else {
            console.log('Fetched reservations for', dateString, ':', data);
            setReservations(data || []);
        }
    };

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
        }).format(date).toUpperCase();
    };


    const isPastSlot = (time: string) => {
        const now = new Date();
        const slotDateTime = new Date(selectedDate);
        const [hours, minutes] = time.split(':');
        slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return slotDateTime < now;
    };

    const getSlotStatus = (courtId: number, time: string) => {
        // Normalize time format: '08:00' or '08:00:00' -> '08:00'
        const normalizeTime = (t: string) => t.substring(0, 5);

        const reservation = reservations.find(
            (r) => r.court_id === courtId && normalizeTime(r.start_time) === normalizeTime(time)
        );

        if (reservation) {
            // Admin reservations: special display
            if (reservation.created_by_admin && reservation.status === 'confirmed') {
                const typeColors = {
                    cours: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
                    match: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
                    interclub: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
                    admin: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
                    normal: 'bg-[#4c7650] text-white'
                };

                return {
                    status: 'Admin',
                    color: typeColors[reservation.reservation_type || 'normal'],
                    bookedBy: reservation.description || reservation.user_name,
                    isPast: isPastSlot(time),
                    reservation: reservation
                };
            }

            // Confirmed reservations block the slot
            if (reservation.status === 'confirmed') {
                return {
                    status: 'Réservé',
                    color: 'bg-[#4c7650] text-white',
                    bookedBy: reservation.user_name,
                    isPast: isPastSlot(time),
                    reservation: reservation
                };
            }

            // Pending reservations also block the slot but with different styling
            if (reservation.status === 'pending') {
                return {
                    status: 'En attente',
                    color: 'bg-orange-100 text-orange-700 border-2 border-orange-300',
                    bookedBy: reservation.user_name,
                    isPast: isPastSlot(time),
                    reservation: reservation
                };
            }
        }

        // Check if slot is in the past
        if (isPastSlot(time)) {
            return {
                status: 'Passé',
                color: 'bg-gray-100 text-gray-400',
                bookedBy: null,
                isPast: true,
                reservation: undefined
            };
        }

        return {
            status: 'Disponible',
            color: 'bg-white hover:bg-[#4c7650]/5 text-[#4c7650]',
            bookedBy: null,
            isPast: false,
            reservation: undefined
        };
    };

    const handleConfirmReservation = async (reservationId: string) => {
        if (!user) return;

        setNotification(null);

        const confirmerName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Membre';

        const { error } = await supabase
            .from('reservations')
            .update({
                status: 'confirmed',
                confirmed_by: user.id,
                confirmed_by_name: confirmerName,
                confirmed_at: new Date().toISOString()
            })
            .eq('id', reservationId)
            .eq('status', 'pending')
            .neq('user_id', user.id); // Cannot confirm own reservation

        if (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors de la confirmation. Veuillez réessayer.'
            });
            console.error('Confirmation error:', error);
        } else {
            setNotification({
                type: 'success',
                message: 'Réservation confirmée avec succès !'
            });
            fetchReservations();
        }

        setTimeout(() => setNotification(null), 3000);
    };

    const handleBooking = async () => {
        if (!selectedSlot || !user) return;

        setBookingLoading(true);
        setNotification(null);

        const dateString = selectedDate.toISOString().split('T')[0];
        const userName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Membre';

        // Check if user already has a booking for this date
        const existingBooking = reservations.find(r => r.user_id === user.id);

        if (existingBooking) {
            setBookingLoading(false);
            setNotification({
                type: 'error',
                message: 'Vous avez déjà une réservation pour cette date. Limite : 1 heure par jour.'
            });
            setTimeout(() => setNotification(null), 4000);
            return;
        }

        // Calculate expiration time (15 minutes from now)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        const { error } = await supabase
            .from('reservations')
            .insert({
                user_id: user.id,
                court_id: selectedSlot.courtId,
                date: dateString,
                start_time: selectedSlot.time,
                user_name: userName,
                status: 'pending',
                expires_at: expiresAt.toISOString()
            });

        setBookingLoading(false);

        if (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors de la réservation. Veuillez réessayer.'
            });
            console.error('Booking error:', error);
            console.error('Error stringified:', JSON.stringify(error, null, 2));
            console.error('Error details:', { message: error.message, code: error.code, details: error.details, hint: error.hint });
        } else {
            setNotification({
                type: 'success',
                message: 'Réservation créée ! Un autre membre doit la confirmer dans les 15 minutes.'
            });
            setSelectedSlot(null);
            fetchReservations();
        }

        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-[#4c7650]/20 border-t-[#4c7650] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#fcfdfc] pt-32 flex flex-col">
            <Header />

            <div className="flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    {/* Clean Header Area */}
                    <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-left">
                            <h1 className="text-4xl font-extrabold text-[#2d452e] tracking-tight">Espace Réservation</h1>
                            <div className="flex items-center gap-4 mt-1">
                                <p className="text-[#4c7650]/60 font-medium">Bonjour, {user?.user_metadata?.first_name || 'Membre'}</p>
                                <div className="w-1 h-1 rounded-full bg-[#4c7650]/20" />
                                <button
                                    onClick={() => setShowHelp(true)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#4c7650] hover:text-[#2d452e] transition-colors group"
                                >
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="border-b border-[#4c7650]/30 group-hover:border-[#2d452e]">Comment réserver ?</span>
                                </button>
                            </div>
                        </div>

                        {/* Date Navigation - Brand Theme */}
                        <div className="flex items-center gap-4 bg-[#4c7650] text-white p-2 rounded-[24px] shadow-xl">
                            <button
                                onClick={() => changeDate(-1)}
                                className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-xl min-w-[240px] text-center">
                                <span className="text-sm font-black tracking-widest">{formatDate(selectedDate)}</span>
                            </div>
                            <button
                                onClick={() => changeDate(1)}
                                className="p-3 hover:bg-white/10 rounded-2xl transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Reservation Table - Brand Styling */}
                    <div className="bg-white rounded-[40px] border border-[#4c7650]/15 overflow-hidden shadow-[0_20px_60px_rgba(76,118,80,0.06)] relative">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#4c7650]/5">
                                        <th className="sticky left-0 z-20 bg-white border-b border-r border-[#4c7650]/10 p-6 w-24 min-h-[80px]">
                                            <div className="h-full flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-[#4c7650]" />
                                            </div>
                                        </th>
                                        {COURTS.map(court => (
                                            <th key={court.id} className="p-6 border-b border-r border-[#4c7650]/10 last:border-r-0 min-w-[160px]">
                                                <div className="text-center">
                                                    <div className="text-sm font-black text-[#2d452e] uppercase tracking-wider">{court.name}</div>
                                                    <div className="text-[10px] text-[#4c7650]/50 font-bold uppercase mt-1">
                                                        {court.type} • {court.surface}
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {TIME_SLOTS.map(time => (
                                        <tr key={time} className="group">
                                            <td className="sticky left-0 z-20 bg-white p-4 border-b border-r border-[#4c7650]/10 text-center font-bold text-[#2d452e]/80 text-sm tabular-nums">
                                                {time}
                                            </td>
                                            {COURTS.map(court => {
                                                const { status, color, bookedBy, isPast, reservation } = getSlotStatus(court.id, time);
                                                const isAvailable = status === 'Disponible';
                                                const isPastUnreserved = status === 'Passé';
                                                const isPending = status === 'En attente';
                                                const canConfirm = isPending && reservation && reservation.user_id !== user?.id;

                                                return (
                                                    <td
                                                        key={`${court.id}-${time}`}
                                                        className={`p-0 border-b border-r border-[#4c7650]/10 last:border-r-0 min-h-16 transition-all`}
                                                    >
                                                        {isPending && reservation ? (
                                                            <div className={`w-full h-full p-2 flex flex-col items-center justify-center gap-1 ${color}`}>
                                                                <span className="text-[9px] font-bold uppercase tracking-wide">{bookedBy}</span>
                                                                {reservation.expires_at && (
                                                                    <TimeRemaining expiresAt={reservation.expires_at} className="text-[9px]" />
                                                                )}
                                                                {canConfirm && (
                                                                    <button
                                                                        onClick={() => handleConfirmReservation(reservation.id)}
                                                                        className="mt-1 px-2 py-0.5 bg-[#4c7650] text-white rounded text-[9px] font-bold hover:bg-[#2d452e] transition-all"
                                                                    >
                                                                        Confirmer
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => isAvailable && setSelectedSlot({ court: court.name, courtId: court.id, time })}
                                                                disabled={!isAvailable}
                                                                className={`w-full h-full min-h-[64px] flex items-center justify-center transition-all group/cell ${color} ${!isAvailable ? 'cursor-not-allowed' : 'relative overflow-hidden'}`}
                                                                title={bookedBy ? `Réservé par ${bookedBy}` : (isPastUnreserved ? 'Créneau passé' : '')}
                                                            >
                                                                {isAvailable ? (
                                                                    <div className="opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-2 text-xs font-bold uppercase tracking-tighter">
                                                                        <Plus className="w-4 h-4 translate-y-px" />
                                                                        <span>Réserver</span>
                                                                    </div>
                                                                ) : isPastUnreserved ? (
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Passé</span>
                                                                ) : status === 'Admin' && reservation ? (
                                                                    // Réservation admin : afficher la description
                                                                    <div className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 w-full">
                                                                        <div className="text-[8px] font-black uppercase tracking-wide opacity-60">
                                                                            {reservation.reservation_type || 'Admin'}
                                                                        </div>
                                                                        <div className="text-[10px] font-bold text-center leading-tight px-1">
                                                                            {reservation.description || bookedBy}
                                                                        </div>
                                                                    </div>
                                                                ) : status === 'Réservé' && reservation ? (
                                                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                                                        <div className="text-white text-xs font-medium leading-tight">
                                                                            {(() => {
                                                                                const parts = reservation.user_name.split(' ');
                                                                                const first = parts[0];
                                                                                const last = parts.slice(1).join(' ').toUpperCase();
                                                                                return `${first} ${last}`;
                                                                            })()}
                                                                        </div>
                                                                        <div className="text-white text-xs font-medium leading-tight">
                                                                            {(() => {
                                                                                const name = reservation.confirmed_by_name || 'Confirmé';
                                                                                const parts = name.split(' ');
                                                                                const first = parts[0];
                                                                                const last = parts.slice(1).join(' ').toUpperCase();
                                                                                return `${first} ${last}`;
                                                                            })()}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-[10px] font-medium uppercase tracking-wide">{bookedBy}</span>
                                                                )}
                                                            </button>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>


                </div>

                {/* Notification */}
                {notification && (
                    <div className={`fixed top-24 right-4 z-50 animate-in slide-in-from-top-4 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border-2 rounded-2xl px-6 py-4 shadow-xl max-w-md`}>
                        <p className="font-bold text-sm">{notification.message}</p>
                    </div>
                )}

                {/* Premium Confirmation Modal */}
                {selectedSlot && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2d452e]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedSlot(null)} />
                        <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-10 bg-[#4c7650] text-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-3xl font-black mb-2 tracking-tight">Confirmation</h3>
                                        <div className="h-1 w-12 bg-[#f6ca73] rounded-full" />
                                    </div>
                                    <button onClick={() => setSelectedSlot(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-10">
                                    <div>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Terrain</p>
                                        <p className="text-xl font-black">{selectedSlot.court}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Horaire</p>
                                        <p className="text-xl font-black">{selectedSlot.time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="flex items-start gap-4 p-5 bg-[#4c7650]/5 rounded-3xl border border-[#4c7650]/10">
                                    <Calendar className="w-6 h-6 text-[#4c7650] shrink-0" />
                                    <p className="text-sm font-bold text-[#2d452e]">Séance du {formatDate(selectedDate)}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleBooking}
                                        disabled={bookingLoading}
                                        className="w-full py-5 bg-[#4c7650] text-white rounded-[24px] font-black text-xl shadow-lg shadow-[#4c7650]/20 hover:bg-[#2d452e] hover:-translate-y-1 transition-all active:scale-95 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {bookingLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>EN COURS...</span>
                                            </div>
                                        ) : (
                                            'RÉSERVER'
                                        )}
                                    </button>
                                    <button onClick={() => setSelectedSlot(null)} className="w-full py-4 bg-[#4c7650]/5 text-[#4c7650] rounded-[24px] font-bold hover:bg-[#4c7650]/10 transition-all">
                                        ANNULER
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Help Modal - Premium Design */}
            {showHelp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2d452e]/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setShowHelp(false)} />
                    <div className="relative w-full max-w-2xl bg-gradient-to-br from-white to-[#fcfdfc] rounded-[48px] shadow-[0_50px_120px_rgba(45,69,46,0.25)] overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="relative px-10 pt-10 pb-8">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="absolute top-8 right-8 p-3 hover:bg-[#4c7650]/10 rounded-2xl transition-all group"
                            >
                                <X className="w-6 h-6 text-[#4c7650] group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-4 bg-gradient-to-br from-[#4c7650] to-[#2d452e] rounded-3xl shadow-lg">
                                    <Info className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-[#2d452e] tracking-tight">Comment réserver ?</h3>
                                    <p className="text-[#4c7650]/60 font-semibold text-sm mt-1">En 4 étapes simples</p>
                                </div>
                            </div>
                        </div>

                        {/* Steps - Card Layout */}
                        <div className="px-10 pb-10 space-y-4">
                            {[
                                {
                                    num: "01",
                                    title: "Choisissez la date",
                                    text: "Naviguez entre les jours avec les flèches en haut de page",
                                    icon: <Calendar className="w-5 h-5" />
                                },
                                {
                                    num: "02",
                                    title: "Sélectionnez un créneau",
                                    text: "Cliquez sur une case blanche dans la grille des terrains",
                                    icon: <Plus className="w-5 h-5" />
                                },
                                {
                                    num: "03",
                                    title: "Confirmez votre choix",
                                    text: "Vérifiez les détails et cliquez sur 'RÉSERVER'",
                                    icon: <ChevronRight className="w-5 h-5" />
                                },
                                {
                                    num: "04",
                                    title: "C'est réservé !",
                                    text: "Préparez vos raquettes et rendez-vous au club",
                                    icon: <Calendar className="w-5 h-5" />
                                }
                            ].map((step, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white border-2 border-[#4c7650]/10 rounded-3xl p-6 hover:border-[#4c7650]/30 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-5">
                                        {/* Number Badge */}
                                        <div className="relative shrink-0">
                                            <div className="absolute inset-0 bg-[#f6ca73]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                                            <div className="relative w-14 h-14 bg-gradient-to-br from-[#f6ca73] to-[#e5b962] rounded-2xl flex items-center justify-center shadow-lg">
                                                <span className="text-2xl font-black text-[#2d452e]">{step.num}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow pt-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="text-[#4c7650]">{step.icon}</div>
                                                <h4 className="text-lg font-black text-[#2d452e]">{step.title}</h4>
                                            </div>
                                            <p className="text-[#4c7650]/70 font-medium text-sm leading-relaxed">{step.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Button */}
                        <div className="px-10 pb-10">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="w-full py-5 bg-gradient-to-r from-[#4c7650] to-[#3a5a3d] text-white rounded-[28px] font-black text-xl shadow-xl shadow-[#4c7650]/20 hover:shadow-2xl hover:shadow-[#4c7650]/30 hover:-translate-y-1 transition-all active:scale-95 duration-300"
                            >
                                J'AI COMPRIS ! 🎾
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Interface - Only visible for admins */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                {isUserAdmin && user && <AdminBulkReservations user={user} />}
            </div>

            <Footer />
        </main>
    );
}
