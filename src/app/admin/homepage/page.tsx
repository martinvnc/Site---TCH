"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/roles";
import { Trophy, Calendar, Users, Star, Plus, Trash2, Eye, EyeOff, Edit2, Loader2, ArrowLeft, ArrowRight, Upload, Target, X, Bold, Italic, Underline, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

type News = {
    id: string;
    title: string;
    date: string;
    category: string;
    description: string;
    image: string;
    image_url?: string;
    image_urls?: string[];
    button_text?: string;
    button_url?: string;
    is_visible: boolean;
};

type Result = {
    id: string;
    players: string;
    type: string;
    score: string;
    status: string;
    date: string;
    icon: string;
    image_url: string;
    is_visible: boolean;
};

export default function AdminHomepage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [news, setNews] = useState<News[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [activeTab, setActiveTab] = useState<"news" | "results">("news");

    // Modals
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [editingResult, setEditingResult] = useState<Result | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const [showButton, setShowButton] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Synchronize editor content on modal open/edit
    useEffect(() => {
        if (isNewsModalOpen && editorRef.current) {
            editorRef.current.innerHTML = newsForm.description;
        }
    }, [isNewsModalOpen, editingNews]);

    // Form states
    const [newsForm, setNewsForm] = useState({ title: "", date: new Date().toISOString().split('T')[0], category: "Événement", description: "", image: "🎾", image_url: "", image_urls: [] as string[], button_text: "", button_url: "" });
    const [resultForm, setResultForm] = useState({
        players: "",
        type: "",
        score: "",
        status: "",
        date: new Date().toISOString().split('T')[0],
        icon: "Trophy",
        image_url: "",
        // Amical/Tournoi specific
        p1Name: "",
        p2Name: "",
        tournamentName: "",
        tournamentWinner: "p1", // p1 or p2
        matchFormat: "stb", // stb or set
        s1_p1: "", s1_p2: "",
        s2_p1: "", s2_p2: "",
        s3_p1: "", s3_p2: "",
        stb_p1: "", stb_p2: ""
    });

    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setAuthorized(false);
            setLoading(false);
            router.push("/login");
            return;
        }

        const admin = await isAdmin(user.id);
        setAuthorized(admin);

        if (admin) {
            await Promise.all([fetchNews(), fetchResults()]);
        } else {
            router.push("/");
        }
        setLoading(false);
    };

    const fetchNews = async () => {
        const { data, error } = await supabase
            .from("homepage_news")
            .select("*")
            .order("date", { ascending: false });
        if (!error && data) setNews(data);
    };

    const fetchResults = async () => {
        const { data, error } = await supabase
            .from("homepage_results")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && data) setResults(data);
    };

    const toggleVisibility = async (table: string, id: string, current: boolean) => {
        const { error } = await supabase
            .from(table)
            .update({ is_visible: !current })
            .eq("id", id);

        if (!error) {
            if (table === "homepage_news") fetchNews();
            else fetchResults();
        }
    };

    const deleteItem = async (table: string, id: string) => {
        if (!confirm("Supprimer cet élément ?")) return;

        const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", id);

        if (!error) {
            if (table === "homepage_news") fetchNews();
            else fetchResults();
        }
    };

    const handleNewsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = editingNews
            ? await supabase.from("homepage_news").update(newsForm).eq("id", editingNews.id)
            : await supabase.from("homepage_news").insert([newsForm]);

        if (!error) {
            setIsNewsModalOpen(false);
            setNewsForm({ title: "", date: new Date().toISOString().split('T')[0], category: "Événement", description: "", image: "🎾", image_url: "", image_urls: [], button_text: "", button_url: "" });
            setShowButton(false);
            setEditingNews(null);
            await fetchNews();
        } else {
            console.error('Erreur submission news:', error);
            alert("Erreur lors de l'enregistrement : " + (error.message || JSON.stringify(error, null, 2)));
        }
        setSaving(false);
    };

    const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if ((newsForm.image_urls?.length || 0) + files.length > 5) {
            alert("Maximum 5 photos par actualité.");
            return;
        }

        setSaving(true);
        const newUrls = [...(newsForm.image_urls || [])];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `news/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('homepage')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Erreur upload:', uploadError);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('homepage')
                .getPublicUrl(filePath);

            newUrls.push(publicUrl);
        }

        setNewsForm(prev => ({ ...prev, image_urls: newUrls, image_url: newUrls[0] || "" }));
        setSaving(false);
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Required for Firefox
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newUrls = [...(newsForm.image_urls || [])];
        const draggedItem = newUrls[draggedIndex];
        newUrls.splice(draggedIndex, 1);
        newUrls.splice(index, 0, draggedItem);

        setNewsForm(prev => ({ ...prev, image_urls: newUrls, image_url: newUrls[0] || "" }));
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `results/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('homepage')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Erreur upload:', uploadError);
            setSaving(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('homepage')
            .getPublicUrl(filePath);

        setResultForm(prev => ({ ...prev, image_url: publicUrl }));
        setSaving(false);
    };

    const handleResultSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        let finalForm = { ...resultForm };

        // Scoring logic for sets (Amical & Tournoi)
        if ((resultForm.type === "Match amical" || resultForm.type === "Tournoi") && resultForm.s1_p1 && resultForm.s1_p2 && resultForm.s2_p1 && resultForm.s2_p2) {
            const sets = [];

            // Set 1
            let s1 = `${resultForm.s1_p1}/${resultForm.s1_p2}`;
            sets.push(s1);

            // Set 2
            let s2 = `${resultForm.s2_p1}/${resultForm.s2_p2}`;
            sets.push(s2);

            // Logic check for STB
            const s1p1 = parseInt(resultForm.s1_p1) || 0;
            const s1p2 = parseInt(resultForm.s1_p2) || 0;
            const s2p1 = parseInt(resultForm.s2_p1) || 0;
            const s2p2 = parseInt(resultForm.s2_p2) || 0;

            let p1Sets = s1p1 > s1p2 ? 1 : 0;
            let p2Sets = s1p2 > s1p1 ? 1 : 0;
            if (s2p1 > s2p2) p1Sets++; else if (s2p2 > s2p1) p2Sets++;

            // Only add STB if sets are 1-1 and format is STB
            if (p1Sets === 1 && p2Sets === 1 && resultForm.matchFormat === "stb" && resultForm.stb_p1 && resultForm.stb_p2) {
                sets.push(`${resultForm.stb_p1}-${resultForm.stb_p2}`);
                const stbp1 = parseInt(resultForm.stb_p1) || 0;
                const stbp2 = parseInt(resultForm.stb_p2) || 0;
                if (stbp1 > stbp2) p1Sets++; else p2Sets++;
            }

            // Only add Set 3 if sets are 1-1 and format is Set
            if (p1Sets === 1 && p2Sets === 1 && resultForm.matchFormat === "set" && resultForm.s3_p1 && resultForm.s3_p2) {
                let s3 = `${resultForm.s3_p1}/${resultForm.s3_p2}`;
                sets.push(s3);
                const s3p1 = parseInt(resultForm.s3_p1) || 0;
                const s3p2 = parseInt(resultForm.s3_p2) || 0;
                if (s3p1 > s3p2) p1Sets++; else p2Sets++;
            }

            finalForm.score = sets.join(" ");

            if (resultForm.type === "Tournoi") {
                finalForm.players = `${resultForm.p1Name} | Adversaire`;
                finalForm.status = resultForm.tournamentName;
            } else {
                finalForm.players = `${resultForm.p1Name} | ${resultForm.p2Name}`;
                finalForm.status = p1Sets > p2Sets ? `Vainqueur: ${resultForm.p1Name}` : `Vainqueur: ${resultForm.p2Name}`;
            }
        }

        if (resultForm.type === "Interclub" && resultForm.p1Name && resultForm.p2Name && resultForm.s1_p1 && resultForm.s1_p2) {
            finalForm.players = `${resultForm.p1Name} | ${resultForm.p2Name}`;
            finalForm.score = `${resultForm.s1_p1}-${resultForm.s1_p2}`;
            // status is already set to Division/Day from the specialized input
        }

        // Clean up temporary fields before sending to Supabase
        const {
            p1Name, p2Name, tournamentName, tournamentWinner, matchFormat,
            s1_p1, s1_p2, s2_p1, s2_p2, s3_p1, s3_p2, stb_p1, stb_p2,
            ...submitData
        } = finalForm;

        const { error } = editingResult
            ? await supabase.from("homepage_results").update(submitData).eq("id", editingResult.id)
            : await supabase.from("homepage_results").insert([submitData]);

        if (!error) {
            setIsResultModalOpen(false);
            setResultForm({
                players: "", type: "", score: "", status: "",
                date: new Date().toISOString().split('T')[0],
                icon: "Trophy", image_url: "",
                p1Name: "", p2Name: "",
                tournamentName: "",
                tournamentWinner: "p1",
                matchFormat: "stb",
                s1_p1: "", s1_p2: "",
                s2_p1: "", s2_p2: "",
                s3_p1: "", s3_p2: "",
                stb_p1: "", stb_p2: ""
            });
            setEditingResult(null);
            await fetchResults();
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#4c7650]" />
            </div>
        );
    }

    if (authorized === false) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />

            <div className="max-w-6xl mx-auto px-10 sm:px-16 lg:px-24 pt-32 lg:pt-40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div>
                        <Link href="/mon-compte" className="text-sm text-[#4c7650] font-medium flex items-center gap-2 mb-2 hover:underline">
                            <ArrowLeft className="w-4 h-4" />
                            Retour au compte
                        </Link>
                        <h1 className="text-3xl font-black text-[#2d452e]">Administration Home Page</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 p-1 bg-white border border-[#2d452e]/5 rounded-2xl w-fit mb-8 shadow-sm">
                    <button
                        onClick={() => setActiveTab("news")}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "news" ? "bg-[#4c7650] text-white shadow-md shadow-[#4c7650]/20" : "text-[#2d452e] hover:bg-[#4c7650]/5"}`}
                    >
                        Actualités
                    </button>
                    <button
                        onClick={() => setActiveTab("results")}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === "results" ? "bg-[#4c7650] text-white shadow-md shadow-[#4c7650]/20" : "text-[#2d452e] hover:bg-[#4c7650]/5"}`}
                    >
                        Résultats
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl border border-[#2d452e]/5 shadow-xl overflow-hidden">
                    <div className="p-6 md:p-10">
                        {activeTab === "news" ? (
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-[#2d452e]">Gérer les actualités</h2>
                                    <button
                                        onClick={() => {
                                            setEditingNews(null);
                                            setNewsForm({ title: "", date: new Date().toISOString().split('T')[0], category: "Événement", description: "", image: "🎾", image_url: "", image_urls: [], button_text: "", button_url: "" });
                                            setShowButton(false);
                                            setIsNewsModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#4c7650] text-white rounded-xl text-sm font-bold hover:bg-[#3a5a3d] transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Ajouter une news
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {news.map((item) => (
                                        <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-[#4c7650]/5 hover:border-[#4c7650]/20 transition-all gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#2d452e]/5 border border-[#4c7650]/10 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
                                                    {item.image_urls && item.image_urls.length > 0 ? (
                                                        <img src={item.image_urls[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : item.image_url ? (
                                                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="opacity-50">{item.image}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4c7650]">{item.category}</span>
                                                        <span className="text-xs text-gray-400">• {isNaN(new Date(item.date).getTime()) ? item.date : new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <h3 className="font-bold text-[#2d452e]">{item.title}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => toggleVisibility("homepage_news", item.id, item.is_visible)}
                                                    className={`p-2 rounded-lg transition-all ${item.is_visible ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-gray-400 bg-gray-100 hover:bg-gray-200"}`}
                                                    title={item.is_visible ? "Masquer" : "Afficher"}
                                                >
                                                    {item.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingNews(item);
                                                        setNewsForm({
                                                            title: item.title,
                                                            date: item.date,
                                                            category: item.category,
                                                            description: item.description,
                                                            image: item.image,
                                                            image_url: item.image_url || "",
                                                            image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
                                                            button_text: item.button_text || "",
                                                            button_url: item.button_url || ""
                                                        });
                                                        setShowButton(!!item.button_text);
                                                        setIsNewsModalOpen(true);
                                                    }}
                                                    className="p-2 text-[#4c7650] bg-[#4c7650]/5 rounded-lg hover:bg-[#4c7650]/10"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem("homepage_news", item.id)}
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 ml-auto md:ml-0"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-[#2d452e]">Gérer les résultats</h2>
                                    <button
                                        onClick={() => {
                                            setEditingResult(null);
                                            setResultForm({
                                                players: "", type: "", score: "", status: "",
                                                date: new Date().toISOString().split('T')[0],
                                                icon: "Trophy", image_url: "",
                                                p1Name: "", p2Name: "",
                                                tournamentName: "",
                                                tournamentWinner: "p1",
                                                matchFormat: "stb",
                                                s1_p1: "", s1_p2: "",
                                                s2_p1: "", s2_p2: "",
                                                s3_p1: "", s3_p2: "",
                                                stb_p1: "", stb_p2: ""
                                            });
                                            setIsResultModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#4c7650] text-white rounded-xl text-sm font-bold hover:bg-[#3a5a3d] transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> Ajouter un résultat
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {results.map((res) => (
                                        <div key={res.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gray-50 rounded-2xl border border-[#4c7650]/5 hover:border-[#4c7650]/20 transition-all gap-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white border border-[#4c7650]/10 rounded-xl overflow-hidden flex items-center justify-center">
                                                    {res.image_url ? (
                                                        <img src={res.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        res.type === "Tournoi" ? (
                                                            <Trophy className="w-8 h-8 text-[#4c7650]/30" />
                                                        ) : res.type === "Interclub" ? (
                                                            <Target className="w-8 h-8 text-[#4c7650]/30" />
                                                        ) : (
                                                            <Users className="w-8 h-8 text-[#4c7650]/30" />
                                                        )
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4c7650]">{res.type}</span>
                                                        <span className={`text-xs font-bold ${res.status === "Victoire" ? "text-green-600" : "text-red-500"}`}>• {res.status}</span>
                                                    </div>
                                                    <h3 className="font-bold text-[#2d452e]">{res.players}</h3>
                                                    <p className="text-sm font-black text-[#4c7650] mt-1">
                                                        {(() => {
                                                            if (res.type !== "Match amical" && res.type !== "Tournoi") return res.score;
                                                            const raw = res.score.split(" ");
                                                            if (raw.length !== 3) return res.score;

                                                            const s1 = raw[0].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                                            const s2 = raw[1].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                                            const p1S = (s1[0] > s1[1] ? 1 : 0) + (s2[0] > s2[1] ? 1 : 0);
                                                            const p2S = (s1[1] > s1[0] ? 1 : 0) + (s2[1] > s2[0] ? 1 : 0);

                                                            return (p1S === 2 || p2S === 2) ? `${raw[0]} ${raw[1]}` : res.score;
                                                        })()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => toggleVisibility("homepage_results", res.id, res.is_visible)}
                                                    className={`p-2 rounded-lg transition-all ${res.is_visible ? "text-blue-600 bg-blue-50 hover:bg-blue-100" : "text-gray-400 bg-gray-100 hover:bg-gray-200"}`}
                                                >
                                                    {res.is_visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingResult(res);
                                                        // Parse amical fields if needed
                                                        let amicalFields = {
                                                            p1Name: "", p2Name: "",
                                                            tournamentName: "",
                                                            tournamentWinner: "p1",
                                                            matchFormat: "stb" as "stb" | "set",
                                                            s1_p1: "", s1_p2: "",
                                                            s2_p1: "", s2_p2: "",
                                                            s3_p1: "", s3_p2: "",
                                                            stb_p1: "", stb_p2: ""
                                                        };
                                                        if (res.type === "Match amical" || res.type === "Tournoi") {
                                                            const parts = res.players.split(" | ");
                                                            amicalFields.p1Name = parts[0] || "";
                                                            amicalFields.p2Name = parts[1] || "";

                                                            if (res.type === "Tournoi") {
                                                                amicalFields.tournamentName = res.status;
                                                                // Extract winner from score calculation
                                                                const raw = res.score.split(" ");
                                                                if (raw[0] && raw[1]) {
                                                                    const s1 = raw[0].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                                                    const s2 = raw[1].split("/").map(n => parseInt(n.split("(")[0]) || 0);
                                                                    let p1Sets = (s1[0] > s1[1] ? 1 : 0) + (s2[0] > s2[1] ? 1 : 0);
                                                                    let p2Sets = (s1[1] > s1[0] ? 1 : 0) + (s2[1] > s2[0] ? 1 : 0);
                                                                    if (raw[2] && p1Sets === 1 && p2Sets === 1) {
                                                                        const dec = raw[2].split(raw[2].includes("-") ? "-" : "/");
                                                                        if (parseInt(dec[0]) > parseInt(dec[1])) p1Sets++; else p2Sets++;
                                                                    }
                                                                    amicalFields.tournamentWinner = p1Sets > p2Sets ? "p1" : "p2";
                                                                }
                                                            }

                                                            const sets = res.score.split(" ");
                                                            if (sets[0]) {
                                                                const s1 = sets[0].split("/");
                                                                amicalFields.s1_p1 = s1[0];
                                                                amicalFields.s1_p2 = s1[1]?.split("(")[0];
                                                            }
                                                            if (sets[1]) {
                                                                const s2 = sets[1].split("/");
                                                                amicalFields.s2_p1 = s2[0];
                                                                amicalFields.s2_p2 = s2[1]?.split("(")[0];
                                                            }
                                                            if (sets[2]) {
                                                                if (sets[2].includes("/")) {
                                                                    amicalFields.matchFormat = "set";
                                                                    const s3 = sets[2].split("/");
                                                                    amicalFields.s3_p1 = s3[0];
                                                                    amicalFields.s3_p2 = s3[1]?.split("(")[0];
                                                                } else {
                                                                    amicalFields.matchFormat = "stb";
                                                                    const stb = sets[2].split("-");
                                                                    amicalFields.stb_p1 = stb[0];
                                                                    amicalFields.stb_p2 = stb[1];
                                                                }
                                                            }
                                                        }

                                                        if (res.type === "Interclub") {
                                                            const parts = res.players.split(" | ");
                                                            amicalFields.p1Name = parts[0] || "";
                                                            amicalFields.p2Name = parts[1] || "";

                                                            const scores = res.score.split("-");
                                                            amicalFields.s1_p1 = scores[0] || "";
                                                            amicalFields.s1_p2 = scores[1] || "";
                                                            // status (Division) is already in res.status
                                                        }

                                                        setResultForm({ ...res, ...amicalFields });
                                                        setIsResultModalOpen(true);
                                                    }}
                                                    className="p-2 text-[#4c7650] bg-[#4c7650]/5 rounded-lg hover:bg-[#4c7650]/10"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteItem("homepage_results", res.id)}
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 ml-auto md:ml-0"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* News Modal */}
            {isNewsModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-[#2d452e]">{editingNews ? "Modifier l'actualité" : "Ajouter une actualité"}</h2>
                            <button
                                onClick={() => setIsNewsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-[#4c7650] hover:bg-gray-50 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleNewsSubmit} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Catégorie</label>
                                    <select value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium bg-white">
                                        <option value="Événement">Événement</option>
                                        <option value="Tournoi">Tournoi</option>
                                        <option value="Stage">Stage</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Date de l'actualité</label>
                                    <input type="date" value={newsForm.date} onChange={e => setNewsForm({ ...newsForm, date: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium bg-white" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Photos de l'actualité ({newsForm.image_urls?.length || 0}/5)</label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {(newsForm.image_urls || []).map((url, idx) => (
                                        <div
                                            key={idx}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, idx)}
                                            onDragOver={(e) => handleDragOver(e, idx)}
                                            onDrop={(e) => handleDrop(e, idx)}
                                            onDragEnd={() => {
                                                setDraggedIndex(null);
                                                setDragOverIndex(null);
                                            }}
                                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-move group ${draggedIndex === idx ? "opacity-40 scale-95" : "opacity-100"} ${dragOverIndex === idx ? "border-[#4c7650] scale-105" : "border-gray-100"}`}
                                        >
                                            <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />

                                            <button
                                                type="button"
                                                onClick={() => setNewsForm(prev => {
                                                    const filtered = prev.image_urls.filter((_, i) => i !== idx);
                                                    return { ...prev, image_urls: filtered, image_url: filtered[0] || "" };
                                                })}
                                                className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                title="Supprimer la photo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {idx === 0 && (
                                                <div className="absolute bottom-0 inset-x-0 bg-[#4c7650]/90 text-[8px] text-white font-black uppercase tracking-tighter py-0.5 text-center">
                                                    Couverture
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(newsForm.image_urls?.length || 0) < 5 && (
                                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#4c7650]/30 hover:bg-gray-50 transition-all">
                                            <Upload className="w-5 h-5 text-gray-400" />
                                            <span className="text-[8px] text-gray-400 mt-1 font-bold tracking-widest uppercase">Ajouter</span>
                                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleNewsImageUpload} disabled={saving} />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 leading-tight italic">
                                    L'affichage sur le site fera défiler ces photos toutes les 5 secondes.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Titre</label>
                                <input type="text" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} required className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Description</label>
                                <div className="border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-[#4c7650]/30 transition-all">
                                    <div className="flex bg-gray-50 border-b border-gray-100 p-1 gap-1">
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                document.execCommand('bold', false);
                                            }}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                                            title="Gras"
                                        >
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                document.execCommand('italic', false);
                                            }}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                                            title="Italique"
                                        >
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                document.execCommand('underline', false);
                                            }}
                                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                                            title="Souligné"
                                        >
                                            <Underline className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => setNewsForm({ ...newsForm, description: e.currentTarget.innerHTML })}
                                        onBlur={(e) => setNewsForm({ ...newsForm, description: e.currentTarget.innerHTML })}
                                        className="w-full px-4 py-3 min-h-[120px] outline-none text-gray-900 font-medium prose prose-zinc max-w-none bg-white"
                                    />
                                </div>
                            </div>

                            {/* CTA Button Option */}
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showButton}
                                        onChange={(e) => {
                                            setShowButton(e.target.checked);
                                            if (!e.target.checked) setNewsForm(prev => ({ ...prev, button_text: "", button_url: "" }));
                                        }}
                                        className="w-5 h-5 rounded border-gray-300 text-[#4c7650] focus:ring-[#4c7650]"
                                    />
                                    <span className="text-sm font-bold text-[#2d452e]">Ajouter un bouton d'action (Lien externe)</span>
                                </label>

                                {showButton && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Texte du bouton</label>
                                            <input
                                                type="text"
                                                value={newsForm.button_text}
                                                onChange={e => setNewsForm({ ...newsForm, button_text: e.target.value })}
                                                placeholder="ex: S'inscrire maintenant"
                                                required={showButton}
                                                className="w-full px-4 py-2 border-2 border-white rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Lien du bouton (URL)</label>
                                            <input
                                                type="url"
                                                value={newsForm.button_url}
                                                onChange={e => setNewsForm({ ...newsForm, button_url: e.target.value })}
                                                placeholder="https://..."
                                                required={showButton}
                                                className="w-full px-4 py-2 border-2 border-white rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium bg-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsNewsModalOpen(false)} className="flex-1 px-6 py-3 border-2 border-gray-100 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition-all">Annuler</button>
                                <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-[#4c7650] text-white font-bold rounded-xl hover:bg-[#3d5f41] transition-all disabled:opacity-50">
                                    {saving ? "..." : (editingNews ? "Enregistrer" : "Créer")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {isResultModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-[#2d452e]">{editingResult ? "Modifier le résultat" : "Ajouter un résultat"}</h2>
                            <button
                                onClick={() => setIsResultModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-[#4c7650] hover:bg-gray-50 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleResultSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Type Selection First */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Type de résultat</label>
                                <select
                                    value={resultForm.type}
                                    onChange={e => setResultForm({ ...resultForm, type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-bold text-lg"
                                >
                                    <option value="">Sélectionner un type...</option>
                                    <option value="Interclub">Interclub</option>
                                    <option value="Match amical">Match amical</option>
                                    <option value="Tournoi">Tournoi</option>
                                </select>
                            </div>

                            {resultForm.type && (
                                <>
                                    {resultForm.type === "Match amical" || resultForm.type === "Tournoi" ? (
                                        <div className="space-y-6 scale-in-95 animate-in duration-300">
                                            {/* Tournament Name if applicable */}
                                            {resultForm.type === "Tournoi" && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Nom du Tournoi</label>
                                                    <input
                                                        type="text"
                                                        value={resultForm.tournamentName}
                                                        onChange={e => setResultForm({ ...resultForm, tournamentName: e.target.value })}
                                                        required
                                                        placeholder="ex: Tournoi de Thionville"
                                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                    />
                                                </div>
                                            )}

                                            {/* Players Section */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">
                                                        {resultForm.type === "Tournoi" ? "Notre Joueur" : "Joueur 1"}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={resultForm.p1Name}
                                                        onChange={e => setResultForm({ ...resultForm, p1Name: e.target.value })}
                                                        required
                                                        placeholder="Nom du joueur"
                                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                    />
                                                </div>
                                                {resultForm.type === "Match amical" ? (
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Joueur 2</label>
                                                        <input
                                                            type="text"
                                                            value={resultForm.p2Name}
                                                            onChange={e => setResultForm({ ...resultForm, p2Name: e.target.value })}
                                                            required
                                                            placeholder="Nom du joueur"
                                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Résultat du match</label>
                                                        <select
                                                            value={resultForm.tournamentWinner}
                                                            onChange={e => setResultForm({ ...resultForm, tournamentWinner: e.target.value })}
                                                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-bold"
                                                        >
                                                            <option value="p1">Joueur Gagnant</option>
                                                            <option value="p2">Adversaire Gagnant</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Format Selection & Scores Section */}
                                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-5">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#4c7650] italic">Format & Score</h4>
                                                    <select
                                                        value={resultForm.matchFormat}
                                                        onChange={e => setResultForm({ ...resultForm, matchFormat: e.target.value as any })}
                                                        className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none text-[#4c7650]"
                                                    >
                                                        <option value="stb">Super Tie-break</option>
                                                        <option value="set">3ème Set</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s1_p1} onChange={e => setResultForm({ ...resultForm, s1_p1: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none text-gray-900" required />
                                                        <span className="text-center font-black text-gray-400 uppercase text-[12px] tracking-wide italic">Set 1</span>
                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s1_p2} onChange={e => setResultForm({ ...resultForm, s1_p2: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none text-gray-900" required />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s2_p1} onChange={e => setResultForm({ ...resultForm, s2_p1: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none text-gray-900" required />
                                                        <span className="text-center font-black text-gray-400 uppercase text-[12px] tracking-wide italic">Set 2</span>
                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s2_p2} onChange={e => setResultForm({ ...resultForm, s2_p2: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none text-gray-900" required />
                                                    </div>
                                                </div>

                                                {/* Decisive Step (STB or Set 3) */}
                                                {((parseInt(resultForm.s1_p1) > parseInt(resultForm.s1_p2) && parseInt(resultForm.s2_p1) < parseInt(resultForm.s2_p2)) ||
                                                    (parseInt(resultForm.s1_p1) < parseInt(resultForm.s1_p2) && parseInt(resultForm.s2_p1) > parseInt(resultForm.s2_p2))) && (
                                                        <div className="pt-5 mt-1 border-t border-white scale-in-95 animate-in duration-300">
                                                            {resultForm.matchFormat === "stb" ? (
                                                                <div className="grid grid-cols-3 items-center gap-4">
                                                                    <input type="number" min="0" placeholder="Points" value={resultForm.stb_p1} onChange={e => setResultForm({ ...resultForm, stb_p1: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none bg-yellow-50/50 text-gray-900" />
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-px h-8 bg-black/10 my-1 opacity-20" />
                                                                        <span className="text-[9px] font-black uppercase text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full tracking-tighter">STB</span>
                                                                    </div>
                                                                    <input type="number" min="0" placeholder="Points" value={resultForm.stb_p2} onChange={e => setResultForm({ ...resultForm, stb_p2: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none bg-yellow-50/50 text-gray-900" />
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s3_p1} onChange={e => setResultForm({ ...resultForm, s3_p1: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none bg-[#4c7650]/5 text-gray-900" required />
                                                                        <span className="text-center font-black text-[#4c7650] uppercase text-[12px] tracking-wide italic">Set 3</span>
                                                                        <input type="number" min="0" placeholder="Jeu" value={resultForm.s3_p2} onChange={e => setResultForm({ ...resultForm, s3_p2: e.target.value })} className="px-3 py-2 border-2 border-white rounded-xl text-center font-black text-lg focus:border-[#4c7650]/30 outline-none bg-[#4c7650]/5 text-gray-900" required />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    ) : resultForm.type === "Interclub" ? (
                                        <div className="space-y-6 scale-in-95 animate-in duration-300">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Division / Journée</label>
                                                <input
                                                    type="text"
                                                    value={resultForm.status}
                                                    onChange={e => setResultForm({ ...resultForm, status: e.target.value })}
                                                    required
                                                    placeholder="ex: Régionale 1 - J1"
                                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Notre Équipe (TCH)</label>
                                                    <input
                                                        type="text"
                                                        value={resultForm.p1Name}
                                                        onChange={e => setResultForm({ ...resultForm, p1Name: e.target.value })}
                                                        required
                                                        placeholder="ex: TCH 1"
                                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-[#4c7650]/70">Équipe Adverse</label>
                                                    <input
                                                        type="text"
                                                        value={resultForm.p2Name}
                                                        onChange={e => setResultForm({ ...resultForm, p2Name: e.target.value })}
                                                        required
                                                        placeholder="ex: TC Lille"
                                                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest text-center block">Score Global</label>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <input type="number" min="0" placeholder="Points" value={resultForm.s1_p1} onChange={e => setResultForm({ ...resultForm, s1_p1: e.target.value })} className="px-3 py-3 border-2 border-white rounded-xl text-center font-black text-2xl focus:border-[#4c7650]/30 outline-none text-gray-900 bg-gray-50" required />
                                                    <span className="text-center font-black text-gray-400 text-2xl">-</span>
                                                    <input type="number" min="0" placeholder="Points" value={resultForm.s1_p2} onChange={e => setResultForm({ ...resultForm, s1_p2: e.target.value })} className="px-3 py-3 border-2 border-white rounded-xl text-center font-black text-2xl focus:border-[#4c7650]/30 outline-none text-gray-900 bg-gray-50" required />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scale-in-95 animate-in duration-300">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Joueurs</label>
                                                <input
                                                    type="text"
                                                    value={resultForm.players}
                                                    onChange={e => setResultForm({ ...resultForm, players: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Score</label>
                                                <input
                                                    type="text"
                                                    value={resultForm.score}
                                                    onChange={e => setResultForm({ ...resultForm, score: e.target.value })}
                                                    required
                                                    placeholder="Ex: 6/4 7/5"
                                                    className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Date du match</label>
                                            <input
                                                type="date"
                                                value={resultForm.date}
                                                onChange={e => setResultForm({ ...resultForm, date: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium"
                                            />
                                        </div>

                                        {resultForm.type !== "Match amical" && resultForm.type !== "Tournoi" && resultForm.type !== "Interclub" && (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Statut</label>
                                                <select
                                                    value={resultForm.status}
                                                    onChange={e => setResultForm({ ...resultForm, status: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium bg-white"
                                                >
                                                    <option value="Terminé">Terminé</option>
                                                    <option value="En cours">En cours</option>
                                                    <option value="À venir">À venir</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {resultForm.type !== "Match amical" && resultForm.type !== "Tournoi" && resultForm.type !== "Interclub" && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Icône</label>
                                            <select
                                                value={resultForm.icon}
                                                onChange={e => setResultForm({ ...resultForm, icon: e.target.value })}
                                                className="w-full px-4 py-2 border-2 border-gray-100 rounded-xl focus:border-[#4c7650]/30 outline-none text-gray-900 font-medium"
                                            >
                                                <option value="Trophy">Trophée</option>
                                                <option value="Star">Étoile</option>
                                                <option value="Users">Double</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#4c7650] uppercase tracking-widest">Photo du résultat (Optionnel)</label>
                                        <div className="flex items-center gap-4">
                                            {resultForm.image_url ? (
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-100 group">
                                                    <img src={resultForm.image_url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setResultForm(prev => ({ ...prev, image_url: "" }))}
                                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#4c7650]/30 hover:bg-gray-50 transition-all">
                                                    <Upload className="w-6 h-6 text-gray-400" />
                                                    <span className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest">UPLOAD</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={saving} />
                                                </label>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-[10px] text-gray-400 leading-tight">
                                                    Recommandé : Format carré ou paysage. Max 5Mo.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button type="button" onClick={() => setIsResultModalOpen(false)} className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-400 font-bold rounded-xl hover:bg-gray-50 transition-all">Annuler</button>
                                        <button type="submit" disabled={saving} className="flex-1 px-6 py-4 bg-[#4c7650] text-white font-bold rounded-xl hover:bg-[#3d5f41] transition-all disabled:opacity-50 shadow-lg shadow-[#4c7650]/20">
                                            {saving ? "Sauvegarde..." : (editingResult ? "Enregistrer" : "Créer")}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
