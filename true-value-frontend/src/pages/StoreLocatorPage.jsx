import React, { useState } from 'react';
import {
    MapPin, Phone, Clock, Search, Navigation,
    Star, Store, Globe, ChevronRight, Info, Tag, ArrowRight, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import { stores } from '../data/siteData';
import showAlert from '../utils/swal';

const StoreLocatorPage = () => {
    const [zipCode, setZipCode] = useState('');
    const [selectedStore, setSelectedStore] = useState(stores[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!zipCode) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showAlert({
                title: "Grid Search Complete",
                text: `Identified TrueValue nodes near sector ${zipCode}.`,
                icon: "success",
                toast: true,
                position: 'top-end',
                timer: 3000
            });
        }, 800);
    };

    const handleSetFavorite = (store) => {
        showAlert({
            title: "Node Locked",
            text: `${store.name} identified as your primary logistics hub.`,
            icon: "success"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto flex flex-col lg:flex-row w-full h-[calc(100vh-65px)] overflow-hidden">
                {/* Sidebar - Node List */}
                <div className="w-full lg:w-[480px] bg-white border-r border-gray-100 flex flex-col h-full animate-in slide-in-from-left-8 duration-700">
                    <div className="p-10 space-y-10 border-b border-gray-50 bg-white/50 backdrop-blur-xl">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic border border-primary/20">
                                <Compass size={12} className="animate-spin-slow" />
                                Proximity Scanner
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                                Locate <span className="text-primary italic">Node</span>
                            </h1>
                            <p className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase italic">Deploy your local TrueValue infrastructure.</p>
                        </div>

                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-6 text-primary">
                                <Search size={24} className="group-hover:scale-110 transition-transform" />
                            </div>
                            <input
                                type="text"
                                placeholder="Grid sector (ZIP) or City..."
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                className="w-full h-20 pl-16 pr-40 bg-gray-50 rounded-[28px] border border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 text-base font-bold transition-all placeholder:text-gray-300 outline-none shadow-inner"
                            />
                            <button className="absolute inset-y-3 right-3 px-10 bg-[#111811] text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.05] active:scale-95 transition-all shadow-4xl shadow-black/20">
                                Scan
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse rounded-full" />
                                        <MapPin size={64} className="text-primary relative z-10 animate-bounce" />
                                    </div>
                                    <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400 italic">Syncing Coordinates...</p>
                                </div>
                            ) : (
                                stores.map((store, idx) => (
                                    <motion.div
                                        key={store.id}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        onClick={() => setSelectedStore(store)}
                                        className={`group p-8 rounded-[36px] border transition-all cursor-pointer relative overflow-hidden ${selectedStore?.id === store.id ? 'bg-white border-primary/20 shadow-premium scale-[1.02]' : 'bg-transparent border-transparent hover:bg-white hover:shadow-4xl'}`}
                                    >
                                        {selectedStore?.id === store.id && (
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        )}

                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className={`size-14 rounded-2xl flex items-center justify-center transition-all ${selectedStore?.id === store.id ? 'bg-primary text-white shadow-3xl shadow-primary/30' : 'bg-gray-100 text-gray-400 group-hover:bg-primary group-hover:text-white'}`}>
                                                    <Store size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 tracking-tighter uppercase italic text-xl">{store.name}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{store.distance} deployment distance</span>
                                                        <div className="size-1 bg-gray-200 rounded-full" />
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${store.inventory === 'High Stock' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                            {store.inventory}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 font-bold italic leading-relaxed mb-8 pl-1 relative z-10">{store.address}</p>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 relative z-10">
                                            <button className="text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 group/btn italic">
                                                Node Details
                                                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                            <div className="flex gap-3">
                                                <button className="size-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-primary hover:text-white hover:shadow-xl transition-all flex items-center justify-center border border-gray-100">
                                                    <Phone size={18} />
                                                </button>
                                                <button className="size-12 rounded-xl bg-gray-50 text-gray-400 hover:bg-primary hover:text-white hover:shadow-xl transition-all flex items-center justify-center border border-gray-100">
                                                    <Navigation size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Main View - Node Interface */}
                <div className="flex-1 bg-gray-50 flex flex-col relative overflow-hidden animate-in fade-in duration-1000">
                    {/* Simulated Geospatial Interface */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
                            className="w-full h-full object-cover grayscale opacity-20 contrast-125 scale-110"
                            alt="Geospatial visualization"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-transparent to-gray-50/80" />

                        {/* Scanning Lines overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
                    </div>

                    <div className="relative z-10 flex-1 p-10 md:p-20 overflow-y-auto no-scrollbar">
                        <AnimatePresence mode="wait">
                            {selectedStore && (
                                <motion.div
                                    key={selectedStore.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -30 }}
                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                    className="max-w-5xl mx-auto space-y-12"
                                >
                                    {/* Node Command Center */}
                                    <div className="bg-white/80 backdrop-blur-3xl rounded-[4rem] p-12 md:p-20 border border-white shadow-premium relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-0" />

                                        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start gap-16">
                                            <div className="space-y-8 flex-1 w-full">
                                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5">
                                                    Infrastructure Verified
                                                </div>
                                                <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">{selectedStore.name}</h2>

                                                <div className="flex flex-col gap-6">
                                                    <div className="flex items-center gap-4 group/addr">
                                                        <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-premium border border-gray-100 group-hover/addr:scale-110 transition-transform">
                                                            <MapPin size={24} />
                                                        </div>
                                                        <p className="text-xl font-bold italic text-gray-500 leading-tight">{selectedStore.address}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 group/time">
                                                        <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-premium border border-gray-100 group-hover/time:scale-110 transition-transform">
                                                            <Clock size={24} />
                                                        </div>
                                                        <p className="text-xl font-bold italic text-gray-500 leading-tight">Sector Active until {selectedStore.hours.split(' - ')[1]}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleSetFavorite(selectedStore)}
                                                className="w-full xl:w-auto flex items-center justify-center gap-4 h-24 px-12 bg-primary text-white font-black rounded-[32px] shadow-4xl shadow-primary/30 hover:scale-[1.05] active:scale-95 transition-all group"
                                            >
                                                <Star size={28} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                                                <span className="uppercase tracking-[0.3em] text-xs font-black">Primary Hub</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-gray-100/50">
                                            {[
                                                { icon: <Phone size={28} />, label: "Frequency", value: selectedStore.phone },
                                                { icon: <Clock size={28} />, label: "Cycle window", value: selectedStore.hours },
                                                { icon: <Globe size={28} />, label: "Core Protocol", value: "Key Systems, Propane, Logistics" }
                                            ].map((item, i) => (
                                                <div key={i} className="p-10 rounded-[40px] bg-gray-50/50 hover:bg-white hover:shadow-4xl transition-all border border-transparent hover:border-gray-100 space-y-6 group">
                                                    <div className="size-16 rounded-[20px] bg-white flex items-center justify-center text-primary shadow-premium border border-gray-50 group-hover:scale-110 transition-transform">
                                                        {item.icon}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">{item.label}</p>
                                                        <p className="text-2xl font-black tracking-tighter italic text-gray-900 leading-none">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Intelligence Modules */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="bg-[#111811] rounded-[4rem] p-12 flex items-start gap-10 border border-black shadow-4xl text-white relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                            <div className="size-20 bg-white/10 rounded-[28px] flex items-center justify-center text-primary shrink-0 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                                <Info size={36} />
                                            </div>
                                            <div className="space-y-4 relative z-10">
                                                <h4 className="text-3xl font-black italic uppercase tracking-tighter">Manifest Retrieval</h4>
                                                <p className="text-gray-400 font-bold italic leading-relaxed text-lg">Initialize Curbside Protocol and retrieve manifests in {idx === 0 ? '120' : '90'} minutes.</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[4rem] p-12 flex items-start gap-10 border border-gray-50 shadow-premium group hover:shadow-4xl transition-all">
                                            <div className="size-20 bg-primary/10 rounded-[28px] flex items-center justify-center text-primary shrink-0 border border-primary/5 shadow-inner group-hover:scale-110 transition-transform">
                                                <Tag size={36} />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-3xl font-black italic uppercase tracking-tighter">Yield Opportunities</h4>
                                                <p className="text-gray-500 font-bold italic leading-relaxed text-lg">Localized node-exclusive data deals detected for {selectedStore.name}.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-12 flex justify-center">
                                        <button
                                            onClick={() => window.print()}
                                            className="px-16 py-6 border-2 border-gray-200 rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] text-gray-400 hover:text-primary hover:border-primary hover:shadow-4xl transition-all italic flex items-center gap-4 bg-white"
                                        >
                                            Export Node Intel
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StoreLocatorPage;
