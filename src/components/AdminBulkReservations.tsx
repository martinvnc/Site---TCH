"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Calendar, Clock, Plus } from 'lucide-react';

type ReservationType = 'cours' | 'match' | 'interclub' | 'admin';
type RecurrenceType = 'none' | 'daily' | 'weekly';

type BulkReservation = {
    type: ReservationType;
    description: string;
    courts: number[];
    date: string;
    startTime: string;
    endTime: string;
    recurrence: RecurrenceType;
    repeatUntil: string;
};

const COURTS = [
    { id: 1, name: 'Court 1' },
    { id: 2, name: 'Court 2' },
    { id: 3, name: 'Court 3' },
    { id: 4, name: 'Court 4' },
    { id: 5, name: 'Court 5' },
    { id: 6, name: 'Court 6' },
];

const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => {
    const hour = (i + 8).toString().padStart(2, '0');
    return `${hour}:00`;
});

export default function AdminBulkReservations({ user }: { user: User }) {
    const [formData, setFormData] = useState<BulkReservation>({
        type: 'cours',
        description: '',
        courts: [],
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        recurrence: 'none',
        repeatUntil: new Date().toISOString().split('T')[0]
    });

    const [preview, setPreview] = useState<Array<{ date: string, court: number, timeRange: string }>>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [creating, setCreating] = useState(false);
    const [showRecurrence, setShowRecurrence] = useState(false);

    // Generate preview when form changes
    useEffect(() => {
        if (formData.courts.length === 0) {
            setPreview([]);
            return;
        }

        const slots: Array<{ date: string, court: number, timeRange: string }> = [];

        // Si pas de récurrence, créer juste pour la date sélectionnée
        if (formData.recurrence === 'none') {
            formData.courts.forEach(courtId => {
                slots.push({
                    date: formData.date,
                    court: courtId,
                    timeRange: `${formData.startTime} - ${formData.endTime}`
                });
            });
        } else {
            // Avec récurrence, générer plusieurs créneaux
            const start = new Date(formData.date);
            const end = new Date(formData.repeatUntil);
            let currentDate = new Date(start);

            while (currentDate <= end) {
                const shouldInclude =
                    formData.recurrence === 'daily' ? true :
                        formData.recurrence === 'weekly' ? currentDate.getDay() === start.getDay() :
                            false;

                if (shouldInclude) {
                    formData.courts.forEach(courtId => {
                        slots.push({
                            date: currentDate.toISOString().split('T')[0],
                            court: courtId,
                            timeRange: `${formData.startTime} - ${formData.endTime}`
                        });
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
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
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '10:00',
                recurrence: 'none',
                repeatUntil: new Date().toISOString().split('T')[0]
            });

            // Refresh the page to show new reservations
            setTimeout(() => window.location.reload(), 1500);
        }

        setCreating(false);
    };

    return (
        <div className="mt-2 mb-8 bg-[#f8f9f5]/50 rounded-3xl p-6 border border-[#4c7650]/15 shadow-xl shadow-[#4c7650]/5">
            <div className="mb-6 pl-2">
                <h2 className="text-xl font-black text-[#2d452e] uppercase tracking-[0.1em] mb-1 flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-br from-[#4c7650] to-[#2d452e] rounded-xl shadow-md">
                        <Plus className="w-5 h-5 text-white" />
                    </span>
                    Réservation Administrateur
                </h2>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mb-6 p-4 rounded-xl font-black text-sm text-center border-2 animate-in slide-in-from-top-2 duration-300 shadow-md ${notification.type === 'success'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-[#4c7650]/10 overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#4c7650]/10">
                    {/* Form Column */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-[#4c7650] rounded-full" />
                            <h3 className="text-xs font-black text-[#4c7650] uppercase tracking-[0.2em]">
                                Configuration
                            </h3>
                        </div>

                        {/* Type & Date */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-2 ml-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ReservationType })}
                                    className="w-full px-4 py-2.5 border border-[#4c7650]/15 rounded-xl focus:border-[#4c7650]/40 focus:ring-4 focus:ring-[#4c7650]/5 focus:outline-none text-sm font-black text-[#2d452e] bg-[#f8f9f5]/20 appearance-none hover:bg-[#f8f9f5]/40 transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="cours">COURS</option>
                                    <option value="match">MATCH</option>
                                    <option value="interclub">INTERCLUB</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-2 ml-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#4c7650]/15 rounded-xl focus:border-[#4c7650]/40 focus:ring-4 focus:ring-[#4c7650]/5 focus:outline-none text-sm font-black text-[#2d452e] bg-[#f8f9f5]/20 hover:bg-[#f8f9f5]/40 transition-all cursor-pointer shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-2 ml-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Entrez le titre ici..."
                                className="w-full px-4 py-2.5 border border-[#4c7650]/15 rounded-xl focus:border-[#4c7650]/40 focus:ring-4 focus:ring-[#4c7650]/5 focus:outline-none text-sm font-black text-[#2d452e] bg-[#f8f9f5]/20 hover:bg-[#f8f9f5]/40 transition-all shadow-sm placeholder:text-gray-300"
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-2 ml-1">Début</label>
                                <select
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#4c7650]/15 rounded-xl focus:border-[#4c7650]/40 focus:ring-4 focus:ring-[#4c7650]/5 focus:outline-none text-sm font-black text-[#2d452e] bg-[#f8f9f5]/20 hover:bg-[#f8f9f5]/40 transition-all cursor-pointer shadow-sm"
                                >
                                    {TIME_SLOTS.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-2 ml-1">Fin</label>
                                <select
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#4c7650]/15 rounded-xl focus:border-[#4c7650]/40 focus:ring-4 focus:ring-[#4c7650]/5 focus:outline-none text-sm font-black text-[#2d452e] bg-[#f8f9f5]/20 hover:bg-[#f8f9f5]/40 transition-all cursor-pointer shadow-sm"
                                >
                                    {TIME_SLOTS.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Courts Selection */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-black text-[#2d452e]/50 uppercase tracking-widest mb-3 ml-1">Sélection des courts</label>
                            <div className="grid grid-cols-3 gap-3">
                                {COURTS.map(court => (
                                    <button
                                        key={court.id}
                                        onClick={() => handleCourtToggle(court.id)}
                                        className={`px-3 py-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-wider ${formData.courts.includes(court.id)
                                            ? 'bg-gradient-to-br from-[#4c7650] to-[#2d452e] text-white border-transparent shadow-md scale-[1.03]'
                                            : 'bg-[#f8f9f5] text-[#2d452e]/40 border-[#4c7650]/5 hover:bg-[#f8f9f5]/80 hover:border-[#4c7650]/20'
                                            }`}
                                    >
                                        Court {court.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recurrence TCH-Style */}
                        <div className="mb-6">
                            {!showRecurrence ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRecurrence(true);
                                        setFormData({ ...formData, recurrence: 'daily' });
                                    }}
                                    className="text-[10px] font-black text-[#4c7650] uppercase tracking-[0.2em] hover:text-[#2d452e] flex items-center gap-2 px-3 py-2 bg-[#4c7650]/5 rounded-lg hover:bg-[#4c7650]/10 transition-all group w-full justify-center"
                                >
                                    <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                    Récurrence
                                </button>
                            ) : (
                                <div className="p-5 bg-[#f8f9f5] rounded-2xl border border-[#4c7650]/10 shadow-inner">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black text-[#2d452e] uppercase tracking-widest">Récurrence</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowRecurrence(false);
                                                setFormData({ ...formData, recurrence: 'none' });
                                            }}
                                            className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-700"
                                        >
                                            Effacer
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[9px] font-black text-[#2d452e]/40 uppercase tracking-widest mb-2">Fréquence</label>
                                            <select
                                                value={formData.recurrence}
                                                onChange={(e) => setFormData({ ...formData, recurrence: e.target.value as RecurrenceType })}
                                                className="w-full px-3 py-2 border border-[#4c7650]/10 rounded-lg focus:outline-none text-[11px] font-black text-[#2d452e] bg-white"
                                            >
                                                <option value="daily">JOUR</option>
                                                <option value="weekly">SEMAINE</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-[#2d452e]/40 uppercase tracking-widest mb-2">Fin</label>
                                            <input
                                                type="date"
                                                value={formData.repeatUntil}
                                                onChange={(e) => setFormData({ ...formData, repeatUntil: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#4c7650]/10 rounded-lg focus:outline-none text-[11px] font-black text-[#2d452e] bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={preview.length === 0 || creating || !formData.description}
                            className="w-full bg-gradient-to-br from-[#4c7650] to-[#2d452e] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:shadow-lg transition-all active:scale-[0.98] disabled:grayscale disabled:opacity-30 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
                        >
                            {creating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            <span>{creating ? 'Traitement...' : `VALIDER ${preview.length} RÉSERVATION(S) 🎾`}</span>
                        </button>
                    </div>

                    {/* Preview Column */}
                    <div className="p-6 bg-[#f8f9f5]/30">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1 h-6 bg-[#4c7650]/30 rounded-full" />
                            <h3 className="text-xs font-black text-[#4c7650]/60 uppercase tracking-[0.2em]">
                                Aperçu
                            </h3>
                        </div>

                        {preview.length === 0 ? (
                            <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-[#4c7650]/10 rounded-2xl bg-white/50">
                                <Calendar className="w-8 h-8 text-[#4c7650]/20 mb-2" />
                                <p className="text-[10px] font-black text-[#4c7650]/30 uppercase tracking-widest">Aperçu vide</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#4c7650]/20">
                                {preview.map((slot, index) => (
                                    <div key={index} className="group relative bg-white border border-[#4c7650]/5 p-4 rounded-xl flex items-center justify-between transition-all hover:border-[#4c7650]/20 hover:shadow-md">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#f8f9f5] to-white border border-[#4c7650]/10 rounded-lg flex flex-col items-center justify-center">
                                                <span className="text-[8px] font-black text-[#4c7650]/40 uppercase">C{slot.court}</span>
                                            </div>
                                            <div>
                                                <div className="text-[11px] font-black text-[#2d452e] uppercase tracking-wider mb-0.5">{slot.date}</div>
                                                <div className="flex items-center gap-1.5 opacity-70">
                                                    <Clock className="w-3 h-3 text-[#4c7650]" />
                                                    <span className="text-[10px] font-black text-[#4c7650] uppercase tabular-nums">{slot.timeRange}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${formData.type === 'cours' ? 'bg-blue-500/10 text-blue-700 border border-blue-200/50' :
                                            formData.type === 'match' ? 'bg-purple-500/10 text-purple-700 border border-purple-200/50' :
                                                formData.type === 'interclub' ? 'bg-pink-500/10 text-pink-700 border border-pink-200/50' :
                                                    'bg-gray-500/10 text-gray-700 border border-gray-200/50'
                                            }`}>
                                            {formData.type}
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
