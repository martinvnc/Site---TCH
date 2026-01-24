"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Trash2, Info } from "lucide-react";

const COURTS = [
    { id: 1, name: 'Terrain 1', type: 'Indoor', surface: 'Dur' },
    { id: 2, name: 'Terrain 2', type: 'Indoor', surface: 'Résine' },
    { id: 3, name: 'Terrain 3', type: 'Indoor', surface: 'Résine' },
    { id: 4, name: 'Terrain 4', type: 'Outdoor', surface: 'Béton Poreux' },
    { id: 5, name: 'Terrain 5', type: 'Outdoor', surface: 'Béton Poreux' },
    { id: 6, name: 'Terrain 6', type: 'Outdoor', surface: 'Béton Poreux' },
];

type Reservation = {
    id: string;
    user_id: string;
    court_id: number;
    date: string;
    start_time: string;
    user_name: string;
    created_at: string;
};

export default function MyReservationsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/login");
            } else {
                setUser(session.user);
                fetchMyReservations(session.user.id);
                setLoading(false);
            }
        });
    }, [router]);

    const fetchMyReservations = async (userId: string) => {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: true })
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Error fetching reservations:', error);
        } else {
            setReservations(data || []);
        }
    };

    const handleCancelReservation = async (id: string) => {
        setCancellingId(id);
        setNotification(null);

        const { error } = await supabase
            .from('reservations')
            .delete()
            .eq('id', id);

        setCancellingId(null);
        setConfirmDelete(null);

        if (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors de l\'annulation. Veuillez réessayer.'
            });
            console.error('Delete error:', error);
        } else {
            setNotification({
                type: 'success',
                message: 'Réservation annulée avec succès !'
            });
            if (user) {
                fetchMyReservations(user.id);
            }
        }

        setTimeout(() => setNotification(null), 3000);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const getCourtDetails = (courtId: number) => {
        return COURTS.find(c => c.id === courtId) || COURTS[0];
    };

    const isUpcoming = (dateString: string, timeString: string) => {
        const reservationDateTime = new Date(`${dateString}T${timeString}`);
        return reservationDateTime > new Date();
    };

    if (loading) {
        return (
            <main className="flex flex-col min-h-screen bg-white">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-[#4c7650]/20 border-t-[#4c7650] rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    const upcomingReservations = reservations.filter(r => isUpcoming(r.date, r.start_time));
    const pastReservations = reservations.filter(r => !isUpcoming(r.date, r.start_time));

    return (
        <main className="flex flex-col min-h-screen bg-white">
            <Header />

            <div className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    {/* Page Header */}
                    <div className="mb-12">
                        <h1 className="text-5xl font-black text-[#2d452e] mb-4 tracking-tight">
                            Mes Réservations
                        </h1>
                        <p className="text-lg text-[#4c7650]/70 font-medium">
                            Gérez vos créneaux de tennis réservés
                        </p>
                    </div>

                    {/* Notification */}
                    {notification && (
                        <div className={`mb-8 animate-in slide-in-from-top-4 duration-300 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border-2 rounded-2xl px-6 py-4 shadow-xl max-w-md`}>
                            <p className="font-bold text-sm">{notification.message}</p>
                        </div>
                    )}

                    {/* Upcoming Reservations */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-black text-[#2d452e] mb-6 flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-[#4c7650]" />
                            À venir ({upcomingReservations.length})
                        </h2>

                        {upcomingReservations.length === 0 ? (
                            <div className="bg-[#4c7650]/5 border-2 border-[#4c7650]/10 rounded-3xl p-12 text-center">
                                <Info className="w-12 h-12 text-[#4c7650]/40 mx-auto mb-4" />
                                <p className="text-[#4c7650]/60 font-bold text-lg">Aucune réservation à venir</p>
                                <p className="text-[#4c7650]/40 text-sm mt-2">Réservez un créneau pour commencer à jouer !</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {upcomingReservations.map((reservation) => {
                                    const court = getCourtDetails(reservation.court_id);
                                    return (
                                        <div
                                            key={reservation.id}
                                            className="bg-white border-2 border-[#4c7650]/10 rounded-3xl p-6 hover:border-[#4c7650]/30 hover:shadow-lg transition-all group"
                                        >
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    {/* Court */}
                                                    <div>
                                                        <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Terrain</p>
                                                        <p className="text-[#2d452e] font-black text-lg">{court.name}</p>
                                                        <p className="text-[#4c7650]/50 text-xs font-semibold">{court.type} - {court.surface}</p>
                                                    </div>

                                                    {/* Date */}
                                                    <div>
                                                        <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                                                        <p className="text-[#2d452e] font-bold capitalize">{formatDate(reservation.date)}</p>
                                                    </div>

                                                    {/* Time */}
                                                    <div>
                                                        <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Horaire</p>
                                                        <p className="text-[#2d452e] font-black text-lg flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-[#4c7650]" />
                                                            {formatTime(reservation.start_time)}
                                                        </p>
                                                    </div>

                                                    {/* Duration */}
                                                    <div>
                                                        <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Durée</p>
                                                        <p className="text-[#2d452e] font-bold">1 heure</p>
                                                    </div>
                                                </div>

                                                {/* Cancel Button */}
                                                <button
                                                    onClick={() => setConfirmDelete(reservation.id)}
                                                    disabled={cancellingId === reservation.id}
                                                    className="shrink-0 w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Past Reservations */}
                    {pastReservations.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-black text-[#2d452e] mb-6 flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-[#4c7650]/40" />
                                Historique ({pastReservations.length})
                            </h2>

                            <div className="grid gap-4 opacity-60">
                                {pastReservations.map((reservation) => {
                                    const court = getCourtDetails(reservation.court_id);
                                    return (
                                        <div
                                            key={reservation.id}
                                            className="bg-[#4c7650]/5 border-2 border-[#4c7650]/10 rounded-3xl p-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Terrain</p>
                                                    <p className="text-[#2d452e] font-black text-lg">{court.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                                                    <p className="text-[#2d452e] font-bold capitalize">{formatDate(reservation.date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Horaire</p>
                                                    <p className="text-[#2d452e] font-black text-lg">{formatTime(reservation.start_time)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#4c7650]/60 text-xs font-bold uppercase tracking-wider mb-1">Durée</p>
                                                    <p className="text-[#2d452e] font-bold">1 heure</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

            {/* Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2d452e]/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setConfirmDelete(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 bg-red-500 text-white">
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Annuler la réservation ?</h3>
                            <div className="h-1 w-12 bg-white rounded-full" />
                        </div>

                        <div className="p-10 space-y-8">
                            <p className="text-[#2d452e] font-bold text-center">
                                Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleCancelReservation(confirmDelete)}
                                    disabled={cancellingId === confirmDelete}
                                    className="w-full py-5 bg-red-500 text-white rounded-[24px] font-black text-xl shadow-lg shadow-red-500/20 hover:bg-red-600 hover:-translate-y-1 transition-all active:scale-95 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancellingId === confirmDelete ? 'ANNULATION...' : 'OUI, ANNULER'}
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="w-full py-4 bg-[#4c7650]/5 text-[#4c7650] rounded-[24px] font-bold hover:bg-[#4c7650]/10 transition-all"
                                >
                                    NON, GARDER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
