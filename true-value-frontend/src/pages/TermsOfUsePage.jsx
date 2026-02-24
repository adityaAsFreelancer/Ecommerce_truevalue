import React, { useState } from 'react';
import {
    Search, ChevronRight, Printer, Scale,
    ShieldCheck, Book, AlertTriangle, Gavel,
    ArrowRight, Globe, Lock, Command
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';

const TermsOfUsePage = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const handlePrint = () => {
        window.print();
    };

    const tocItems = [
        { id: 'intro', label: '01. Tactical Entry' },
        { id: 'conduct', label: '02. Node Conduct' },
        { id: 'ip', label: '03. Intellectual Matrix' },
        { id: 'liability', label: '04. Liability Bounds' },
        { id: 'governing', label: '05. Sector Law' }
    ];

    return (
        <div className="bg-gray-50 font-display text-gray-900 min-h-screen flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-12 md:py-24 space-y-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#111811] text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-white/5 shadow-xl">
                            <Scale size={16} />
                            Governance Protocol v4.2
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                            Terms of <span className="text-primary italic">Ops</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-bold italic max-w-2xl leading-relaxed">
                            Operational guidelines, conduct protocols, and intellectual security frameworks. Accessing our grid constitutes full synchronization with these terms.
                        </p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="print:hidden h-20 px-10 bg-white border border-gray-100 rounded-[24px] text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-premium transition-all flex items-center gap-4 group italic text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                        <Printer size={22} className="group-hover:scale-110 transition-transform" />
                        Hardcopy Export
                    </button>
                </div>

                <div className="flex flex-col xl:flex-row gap-20 items-start">
                    {/* Sticky Sidebar Toc */}
                    <aside className="print:hidden hidden xl:block w-80 sticky top-[100px] animate-in slide-in-from-left-8 duration-1000">
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-50 shadow-premium space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 italic">
                                    Protocol Map
                                </h4>
                                <nav className="flex flex-col gap-3">
                                    {tocItems.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveSection(item.id);
                                                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`group flex items-center justify-between p-5 rounded-2xl transition-all ${activeSection === item.id
                                                ? 'bg-[#111811] text-primary shadow-4xl shadow-primary/20 scale-[1.05]'
                                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                                            {activeSection === item.id && <ChevronRight size={18} />}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <div className="p-8 bg-gray-50 rounded-[32px] space-y-6 shadow-inner border border-gray-100">
                                    <ShieldCheck size={32} className="text-primary" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-relaxed">
                                        Legitimacy verified for current session cycles.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Matrix */}
                    <article className="flex-1 space-y-24 pb-24 max-w-4xl">
                        {/* Section: Introduction */}
                        <section id="intro" className="scroll-mt-[120px] space-y-10 group animate-in fade-in duration-1000 delay-300">
                            <div className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-gray-50 shadow-premium mb-12">
                                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                                    <Book size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.4em] italic">Last Hash Sync: Oct 2023</p>
                                    <p className="text-gray-400 font-bold italic text-sm">Synchronized protocol for all active grid nodes.</p>
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <span className="text-primary">01</span> Tactical Entry
                            </h2>
                            <div className="prose prose-xl max-w-none text-gray-500 font-bold italic leading-relaxed space-y-8">
                                <p>
                                    Welcome to the TrueValue Command Center. These Terms of Use govern your access to and utilization of the TrueValue architecture, including all content manifesting through our primary and secondary sectors.
                                </p>
                                <p>
                                    By engaging with our interfaces, you acknowledge full synchronization with these protocols. If you decline these operational parameters, you must terminate your grid session immediately.
                                </p>
                            </div>
                        </section>

                        {/* Section: User Conduct */}
                        <section id="conduct" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <span className="text-primary">02</span> Node Conduct
                            </h2>
                            <p className="text-gray-500 font-bold italic text-xl leading-relaxed">
                                Grid participants must operate within lawful parameters. Prohibited operations include:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                {[
                                    "Violation of local or global sector laws.",
                                    "Transmission of encrypted junk, spam, or chain hashes.",
                                    "Impersonation of TrueValue command personnel.",
                                    "Inhibiting the operational flow of other grid nodes."
                                ].map((rule, idx) => (
                                    <div key={idx} className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-white border border-gray-50 hover:shadow-premium transition-all group">
                                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1 shadow-inner group-hover:bg-primary group-hover:text-white transition-colors">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <span className="text-base font-black text-gray-900 italic uppercase tracking-tighter leading-tight">{rule}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Intellectual Matrix */}
                        <section id="ip" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <span className="text-primary">03</span> Intellectual Matrix
                            </h2>
                            <div className="p-10 bg-[#111811] rounded-[4rem] text-white space-y-8 relative overflow-hidden group shadow-4xl border border-black">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="size-20 bg-white/10 rounded-[28px] flex items-center justify-center text-primary mb-4 border border-white/5 shadow-inner">
                                    <Command size={40} />
                                </div>
                                <p className="text-gray-400 font-bold italic text-xl leading-relaxed relative z-10">
                                    The platform, its codebases, visual assets, and data structures are the exclusive intellectual property of TrueValue and its secure partners.
                                </p>
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-primary italic border-t border-white/5 pt-8 relative z-10">
                                    Trademark Verification . SECURE INTEL
                                </div>
                            </div>
                        </section>

                        {/* Section: Liability Bounds */}
                        <section id="liability" className="scroll-mt-[120px] space-y-10 group">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <span className="text-primary">04</span> Liability Bounds
                            </h2>
                            <div className="p-10 bg-white rounded-[3.5rem] border border-gray-50 shadow-premium space-y-8">
                                <p className="text-gray-500 font-bold italic text-xl leading-relaxed uppercase tracking-tighter">
                                    IN NO EVENT WILL TRUEVALUE COMMAND, ITS AFFILIATES, OR SECURE PARTNERS BE LIABLE FOR DATA DAMAGES OF ANY KIND ARISING FROM GRID UTILIZATION OR OPERATIONAL FAILURE.
                                </p>
                            </div>
                        </section>

                        {/* Section: Sector Law */}
                        <section id="governing" className="scroll-mt-[120px] space-y-10 group pb-24 border-b border-gray-100">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <span className="text-primary">05</span> Sector Law
                            </h2>
                            <div className="flex items-center gap-10">
                                <div className="size-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 shadow-inner group-hover:text-primary transition-colors">
                                    <Gavel size={48} />
                                </div>
                                <p className="text-gray-500 font-bold italic text-xl leading-relaxed flex-1">
                                    All grid disputes shall be governed by and construed in accordance with the internal laws of the Sector of Illinois, without giving effect to any conflict of law parameters.
                                </p>
                            </div>
                        </section>

                        {/* Call to Tactical Action */}
                        <div className="py-24 bg-gray-900 rounded-[5rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden shadow-4xl text-white">
                            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-10">
                                <div className="size-20 bg-primary/20 rounded-[28px] flex items-center justify-center text-primary mx-auto border border-white/5 shadow-inner">
                                    <Lock size={40} className="fill-current" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                                        Governance <span className="text-primary italic">Support</span>
                                    </h2>
                                    <p className="text-gray-500 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                                        Operational queries regarding these terms? Transmit directly to our Legal Unit for frequency clarification.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
                                    <a href="mailto:legal@truevalue.com" className="h-20 px-16 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center gap-4">
                                        <Mail size={22} />
                                        legal@truevalue.com
                                    </a>
                                    <Link to="/help" className="h-20 px-16 bg-white/5 text-white border border-white/10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all italic flex items-center gap-4">
                                        Help Terminal
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </main>

            {/* Simple Tactical Footer */}
            <footer className="py-24 text-center space-y-10 animate-in fade-in duration-1000 delay-1000">
                <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                    <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Node</Link>
                    <Link to="/shipping-policy" className="hover:text-primary transition-colors">Logistics Cycle</Link>
                    <Link to="/contact" className="hover:text-primary transition-colors">Contact Hub</Link>
                </div>
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em] italic">© 2023 T-VALUE . ALL NODES SECURE</p>
            </footer>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    body { background: white !important; color: black !important; }
                    section { break-inside: avoid; }
                }
            `}</style>
        </div>
    );
};

export default TermsOfUsePage;
