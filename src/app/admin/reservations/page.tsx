"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/roles';
import { User } from '@supabase/supabase-js';
import { Calendar, Clock, Plus, Trash2, Eye } from 'lucide-react';

type ReservationType = 'cours' | 'match' | 'interclub' | 'admin';
type RecurrenceType = 'none' | 'daily' | 'weekly';

type BulkReservation = {
    type: ReservationType;
    description: string;
    courts: number[];
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    recurrence: RecurrenceType;
};

const COURTS = [
    { id: 1, name: 'Court 1' },
    { id: 2, name: 'Court 2' },
    { id: 3, name: 'Court 3' },
    { id: 4, name: 'Court 4' },
];

export default function AdminReservationsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<BulkReservation>({
        type: 'cours',
        description: '',
        courts: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        recurrence: 'none'
    });

    const [preview, setPreview] = useState<Array<{ date: string, court: number, time: string }>>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error || !session) {
                    if (error) console.error("Session error in AdminReservationsPage:", error);
                    router.push('/login');
                    return;
                }

                setUser(session.user);
                const adminStatus = await isAdmin(session.user.id);

                if (!adminStatus) {
                    router.push('/reservation');
                    return;
                }

                setIsUserAdmin(true);
                setLoading(false);
            } catch (err) {
                console.error("Unexpected session retrieval error in AdminReservationsPage:", err);
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    // Generate preview when form changes
    useEffect(() => {
        if (formData.courts.length === 0) {
            setPreview([]);
            return;
        }

        const slots: Array<{ date: string, court: number, time: string }> = [];
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        let currentDate = new Date(start);

        while (currentDate <= end) {
            const shouldInclude =
                formData.recurrence === 'none' ? currentDate.getTime() === start.getTime() :
                    formData.recurrence === 'daily' ? true :
                        formData.recurrence === 'weekly' ? currentDate.getDay() === start.getDay() :
                            false;

            if (shouldInclude) {
                formData.courts.forEach(courtId => {
                    slots.push({
                        date: currentDate.toISOString().split('T')[0],
                        court: courtId,
                        time: `${formData.startTime} - ${formData.endTime}`
                    });
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        setPreview(slots);
    }, [formData]);

    const handleCourtToggle = (courtId: number) => {
        setFormData(prev => ({
            ...prev,
            courts: prev.courts.includes(courtId)
                ? prev.courts.filter(id => id !== courtId)
                : [...prev.courts, courtId]
        }));
    };

    const handleSubmit = async () => {
        if (!user || preview.length === 0) return;

        setCreating(true);
        setNotification(null);

        const userName = `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Admin';

        // Create all reservations
        const reservations = preview.map(slot => ({
            user_id: user.id,
            user_name: userName,
            court_id: slot.court,
            date: slot.date,
            start_time: formData.startTime,
            status: 'confirmed',
            reservation_type: formData.type,
            description: formData.description,
            created_by_admin: true,
            confirmed_by: user.id,
            confirmed_by_name: userName,
            confirmed_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('reservations')
            .insert(reservations);

        if (error) {
            setNotification({
                type: 'error',
                message: 'Erreur lors de la création des réservations'
            });
            console.error('Error creating reservations:', error);
        } else {
            setNotification({
                type: 'success',
                message: `${preview.length} réservation(s) créée(s) avec succès !`
            });

            // Reset form
            setFormData({
                type: 'cours',
                description: '',
                courts: [],
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                recurrence: 'none'
            });
        }

        setCreating(false);
        setTimeout(() => setNotification(null), 5000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-[#4c7650]">Chargement...</div>
            </div>
        );
    }

    if (!isUserAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f9f5] to-[#e8ede8] py-8">
            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-[#2d452e] mb-2">Gestion Admin</h1>
                    <p className="text-[#4c7650]">Créez des réservations groupées et récurrentes</p>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#2d452e] mb-6">Nouvelle Réservation</h2>

                        {/* Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#2d452e] mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as ReservationType })}
                                className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                            >
                                <option value="cours">Cours</option>
                                <option value="match">Match</option>
                                <option value="interclub">Interclub</option>
                                <option value="admin">Autre (Admin)</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#2d452e] mb-2">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ex: Cours débutants - Coach Marie"
                                className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                            />
                        </div>

                        {/* Courts */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#2d452e] mb-2">Courts</label>
                            <div className="grid grid-cols-2 gap-2">
                                {COURTS.map(court => (
                                    <button
                                        key={court.id}
                                        onClick={() => handleCourtToggle(court.id)}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.courts.includes(court.id)
                                            ? 'bg-[#4c7650] text-white border-[#4c7650]'
                                            : 'bg-white text-[#2d452e] border-[#4c7650]/20 hover:border-[#4c7650]'
                                            }`}
                                    >
                                        {court.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-[#2d452e] mb-2">Date début</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#2d452e] mb-2">Date fin</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Times */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-[#2d452e] mb-2">Heure début</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#2d452e] mb-2">Heure fin</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Recurrence */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-[#2d452e] mb-2">Récurrence</label>
                            <select
                                value={formData.recurrence}
                                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as RecurrenceType })}
                                className="w-full px-4 py-2 border-2 border-[#4c7650]/20 rounded-lg focus:border-[#4c7650] focus:outline-none"
                            >
                                <option value="none">Aucune (une seule fois)</option>
                                <option value="daily">Quotidienne</option>
                                <option value="weekly">Hebdomadaire</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={preview.length === 0 || creating || !formData.description}
                            className="w-full bg-[#4c7650] text-white py-3 rounded-lg font-bold hover:bg-[#2d452e] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            {creating ? 'Création...' : `Créer ${preview.length} réservation(s)`}
                        </button>
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-[#2d452e] mb-6 flex items-center gap-2">
                            <Eye className="w-6 h-6" />
                            Aperçu ({preview.length})
                        </h2>

                        {preview.length === 0 ? (
                            <div className="text-center text-gray-400 py-12">
                                Sélectionnez au moins un court pour voir l'aperçu
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {preview.map((slot, index) => (
                                    <div key={index} className="p-3 bg-[#4c7650]/5 rounded-lg border border-[#4c7650]/10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-[#4c7650]" />
                                                <span className="font-bold text-[#2d452e]">{slot.date}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-4 h-4 text-[#4c7650]" />
                                                <span className="text-sm text-[#4c7650]">{slot.time}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-[#2d452e] font-medium">
                                            Court {slot.court}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
