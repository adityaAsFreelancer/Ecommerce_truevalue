import React, { useState } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import {
    Phone, Wrench, MapPin, Copy, Plus, Minus,
    Facebook, Twitter, Instagram, Mail,
    Send, Clock, Globe, ArrowRight, ArrowUpRight
} from 'lucide-react';
import showAlert from '../utils/swal';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: 'Order Support',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.message) {
            showAlert({
                title: 'Transmission Error',
                text: 'All operational parameters must be populated before broadcast.',
                icon: 'warning'
            });
            return;
        }

        showAlert({
            title: 'Protocol Transmitted',
            text: `Receipt acknowledged for ${formData.fullName}. Dispatch team will respond within 24 cycle hours.`,
            icon: 'success'
        });

        setFormData({
            fullName: '',
            email: '',
            subject: 'Order Support',
            message: ''
        });
    };

    const handleCopyAddress = () => {
        const address = "8600 W Bryn Mawr Ave, Chicago, IL 60631, USA";
        navigator.clipboard.writeText(address).then(() => {
            showAlert({
                title: 'Data Copied',
                text: 'Operational coordinates saved to clipboard.',
                icon: 'success',
                timer: 1500,
                toast: true,
                position: 'top-end'
            });
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-16 md:py-24 space-y-20">
                {/* Hero Section */}
                <div className="flex flex-col gap-8 text-center md:text-left animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic self-center md:self-start border border-primary/20 shadow-xl shadow-primary/5">
                        <Globe size={14} className="animate-spin-slow" />
                        Global Support Protocol
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                        Get In<br /><span className="text-primary italic">Touch</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-bold max-w-2xl italic leading-relaxed">
                        Precision logistics support and DIY intelligence. Whether you're architecting a renovation or deploying a new build, our specialists are ready to transmit solutions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Communication Terminal */}
                    <section className="bg-white p-10 md:p-16 rounded-[4rem] shadow-premium border border-gray-50 flex flex-col gap-12 animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase flex items-center gap-4">
                                <Send className="text-primary" size={32} />
                                Broadcast Hub
                            </h2>
                            <p className="text-gray-400 font-bold italic text-sm">Direct encrypted channel for support and inquiries.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic px-2">Operational Name</label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full h-18 rounded-[24px] bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 px-8 text-gray-900 font-bold transition-all placeholder:text-gray-300 outline-none shadow-inner"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic px-2">Data Receipt</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full h-18 rounded-[24px] bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 px-8 text-gray-900 font-bold transition-all placeholder:text-gray-300 outline-none shadow-inner"
                                        placeholder="Electronic Mail"
                                        type="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic px-2">Subject Protocol</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full h-18 rounded-[24px] bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 px-8 text-gray-900 font-black italic transition-all outline-none shadow-inner appearance-none cursor-pointer"
                                >
                                    <option>Order Intelligence</option>
                                    <option>Product Specifications</option>
                                    <option>Logistics Feedback</option>
                                    <option>Technical Advisory</option>
                                    <option>Global Other</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic px-2">Manifest Content</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full rounded-[32px] bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 p-8 text-gray-900 font-bold min-h-[220px] transition-all placeholder:text-gray-300 outline-none shadow-inner resize-none"
                                    placeholder="Describe your operational requirement..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="h-20 bg-primary text-white font-black rounded-[28px] hover:scale-[1.02] active:scale-95 transition-all text-[11px] uppercase tracking-[0.4em] shadow-4xl shadow-primary/30 flex items-center justify-center gap-4 group"
                            >
                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Initiate Transmission
                            </button>
                        </form>
                    </section>

                    {/* Operational Intel */}
                    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
                        {/* Status Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-premium group hover:border-primary/20 hover:shadow-4xl transition-all">
                                <div className="bg-primary/10 text-primary size-16 rounded-[20px] flex items-center justify-center mb-8 border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                                    <Phone size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Voice Support</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mb-6">Cycle: Mon-Fri: 08:00 - 20:00</p>
                                <a className="text-xl font-black text-primary hover:underline flex items-center gap-2 group-hover:gap-4 transition-all" href="tel:18008783825">
                                    1-800-TRUE-VAL <ArrowRight size={18} />
                                </a>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-premium group hover:border-primary/20 hover:shadow-4xl transition-all">
                                <div className="bg-primary/10 text-primary size-16 rounded-[20px] flex items-center justify-center mb-8 border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                                    <Wrench size={28} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">Tech Intel</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mb-6">Cycle: Sat: 09:00 - 17:00</p>
                                <a className="text-xl font-black text-primary hover:underline flex items-center gap-2 group-hover:gap-4 transition-all" href="tel:18008324457">
                                    1-800-TECH-HLP <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Physical Infrastructure */}
                        <div className="bg-gray-900 p-10 md:p-14 rounded-[4rem] text-white space-y-10 shadow-4xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />

                            <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10">
                                <div className="flex items-start gap-6">
                                    <div className="bg-white/5 text-primary size-16 rounded-[20px] flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                        <MapPin size={28} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">Global Command</h3>
                                        <p className="text-gray-400 text-lg font-bold italic leading-relaxed">
                                            8600 West Bryn Mawr Avenue<br />
                                            Chicago, IL 60631, Global HQ
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopyAddress}
                                    className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-gray-500 hover:text-primary active:scale-90 border border-white/10"
                                >
                                    <Copy size={24} />
                                </button>
                            </div>

                            {/* Logistics Interface (Map Simulation) */}
                            <div className="relative w-full h-[350px] rounded-[3rem] overflow-hidden bg-gray-800 border-4 border-white/5 group-hover:border-primary/20 transition-all shadow-inner">
                                <div
                                    className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-40 group-hover:opacity-70 group-hover:grayscale-0 transition-all duration-[2000ms]"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')"
                                    }}
                                />
                                {/* Scanning Effect */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    <div className="w-full h-[150%] bg-gradient-to-b from-primary/0 via-primary/5 to-primary/0 -translate-y-full animate-scan" />
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-primary text-gray-900 px-6 py-2.5 rounded-[12px] text-[10px] font-black italic tracking-[0.2em] shadow-4xl animate-bounce">
                                            SECURE NODE HQ
                                        </div>
                                        <div className="size-16 bg-primary rounded-full blur-2xl animate-pulse opacity-50 absolute inset-0" />
                                        <MapPin className="text-primary text-6xl drop-shadow-4xl relative z-10" size={64} fill="currentColor" />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                                    <button className="size-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-all shadow-4xl">
                                        <Plus size={20} strokeWidth={3} />
                                    </button>
                                    <button className="size-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-all shadow-4xl">
                                        <Minus size={20} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="absolute bottom-6 left-6 px-6 py-3 bg-[#111811]/60 backdrop-blur-xl border border-white/10 rounded-[18px] text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                                    Scanning Operational Sector...
                                </div>
                            </div>
                        </div>

                        {/* Social Frequency */}
                        <div className="flex items-center justify-between p-10 bg-white rounded-[3rem] shadow-premium border border-gray-50">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Social Bandwidth</span>
                            <div className="flex gap-4">
                                {[Facebook, Twitter, Instagram, Mail].map((Icon, idx) => (
                                    <button key={idx} className="size-14 rounded-2xl bg-gray-50 text-gray-400 hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 flex items-center justify-center shadow-inner border border-gray-100">
                                        <Icon size={20} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;
