import React, { useState } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import {
    Truck, Clock, CheckCircle, Package,
    AlertTriangle, HelpCircle, ChevronRight,
    MapPin, Zap, ShieldCheck, ArrowRight,
    Globe, Anchor, Navigation
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ShippingPolicyPage = () => {
    const [activeSection, setActiveSection] = useState('rates');

    const shippingRates = [
        { method: 'Ground Deployment', time: '3-5 Tactical Days', cost: '$7.99 (Complimentary over $49)' },
        { method: 'Priority Transit', time: '2 Tactical Days', cost: '$14.99' },
        { method: 'Next-Day Payload', time: 'Next Cycle', cost: '$29.99' },
        { method: 'Node Retrieval', time: 'Ready in 2 Cycles', cost: 'COMPLIMENTARY', highlight: true }
    ];

    const returnSteps = [
        { step: 1, title: 'Node Authentication', description: 'Access manifest history via dashboard.' },
        { step: 2, title: 'Resource Selection', description: 'Identify items for reverse logistics.' },
        { step: 3, title: 'Generate Hash', description: 'Produce pre-paid transmission label.' },
        { step: 4, title: 'Drop Off', description: 'Any verified FedEx or UPS sector.' }
    ];

    const sidebarLinks = [
        { id: 'rates', icon: Truck, label: 'Deployment Rates' },
        { id: 'delivery', icon: Clock, label: 'Cycle Timelines' },
        { id: 'returns', icon: Package, label: 'Recall Protocol' },
        { id: 'how-to', icon: HelpCircle, label: 'Return Interface' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <main className="max-w-[1440px] mx-auto w-full px-6 md:px-16 py-12 md:py-24 space-y-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic border border-primary/20 shadow-xl shadow-primary/5">
                            <Navigation size={16} />
                            Logistics Protocol v8.4
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
                            Operational <span className="text-primary italic">Flow</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-bold italic max-w-2xl leading-relaxed">
                            Global deployment matrices, transit costs, and reverse-logistics protocols. Precision management for every resource payload.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-20 items-start">
                    {/* Sticky Sidebar Navigation */}
                    <aside className="hidden xl:block w-80 sticky top-[100px] animate-in slide-in-from-left-8 duration-1000">
                        <div className="p-10 rounded-[3rem] bg-white border border-gray-50 shadow-premium space-y-12">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 italic">
                                    Logistics Menu
                                </h4>
                                <nav className="flex flex-col gap-3">
                                    {sidebarLinks.map((link) => (
                                        <a
                                            key={link.id}
                                            href={`#${link.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveSection(link.id);
                                                document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`group flex items-center justify-between p-5 rounded-2xl transition-all ${activeSection === link.id
                                                ? 'bg-[#111811] text-primary shadow-4xl shadow-primary/20 scale-[1.05]'
                                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <link.icon
                                                    size={22}
                                                    className={`transition-colors ${activeSection === link.id ? 'text-primary' : 'group-hover:text-primary'}`}
                                                />
                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{link.label}</span>
                                            </div>
                                            {activeSection === link.id && <ChevronRight size={18} />}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="pt-10 border-t border-gray-50">
                                <div className="p-8 bg-primary rounded-[32px] text-white space-y-6 shadow-4xl shadow-primary/20 group">
                                    <HelpCircle size={40} className="relative z-10" />
                                    <h5 className="text-xl font-black italic uppercase tracking-tighter leading-tight">Need Support?</h5>
                                    <p className="text-sm font-bold italic leading-relaxed text-white/80">
                                        Tactical team active Mon-Fri 08:00 - 18:00 Central.
                                    </p>
                                    <Link
                                        to="/contact"
                                        className="w-full h-14 bg-white text-primary rounded-xl font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center hover:scale-105 transition-all"
                                    >
                                        Contact Command
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Matrix */}
                    <article className="lg:col-span-9 space-y-24 pb-24 flex-1">
                        {/* Quick Info Callouts */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-1000 delay-300">
                            {[
                                { icon: Package, title: 'Complimentary Ops', desc: 'On orders over $49*', color: 'primary' },
                                { icon: Clock, title: '30-Cycle Recall', desc: 'Hassle-free reverse logistics', color: 'primary' },
                                { icon: ShieldCheck, title: 'Pro-Encryption', desc: 'Secure payload handling', color: 'primary' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-10 bg-white border border-gray-50 rounded-[3rem] shadow-premium hover:shadow-4xl transition-all group">
                                    <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                        <item.icon size={32} />
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors">{item.title}</h4>
                                    <p className="text-gray-400 font-bold italic text-sm mt-2">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Rates Table */}
                        <section id="rates" className="scroll-mt-[120px] space-y-10 group animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">01</div>
                                Deployment Matrix
                            </h2>
                            <div className="bg-white border border-gray-50 rounded-[4rem] overflow-hidden shadow-premium">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 italic">
                                                <th className="px-10 py-8">Protocol</th>
                                                <th className="px-10 py-8">Transit Cycles</th>
                                                <th className="px-10 py-8 text-right">Settlement</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {shippingRates.map((rate, index) => (
                                                <tr key={index} className="group/row hover:bg-gray-50 transition-colors">
                                                    <td className="px-10 py-8 font-black text-gray-900 italic uppercase tracking-tighter text-xl">{rate.method}</td>
                                                    <td className="px-10 py-8 text-gray-400 font-bold italic text-lg">{rate.time}</td>
                                                    <td className={`px-10 py-8 text-right font-black italic text-lg ${rate.highlight ? 'text-primary' : 'text-gray-900'}`}>
                                                        {rate.cost}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Returns Policy Section */}
                        <section id="returns" className="scroll-mt-[120px] space-y-10 group animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">02</div>
                                30-Cycle Recall
                            </h2>
                            <div className="space-y-10">
                                <p className="text-gray-500 font-bold italic text-xl leading-relaxed max-w-4xl">
                                    We demand absolute synchronization with your manifest satisfaction. If payload parameters are insufficient, initiate a recall within <strong>30 cycles</strong> for a full credit restoration.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {[
                                        { title: 'Resource Condition', desc: 'Items must remain in original, initialized condition with all packaging hashes intact.' },
                                        { icon: AlertTriangle, title: 'Non-Recallable', desc: 'Custom resource mixes, tainted stains, and modified hardware are permanent deployments.' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-10 bg-white border border-gray-50 rounded-[3rem] shadow-premium space-y-4">
                                            <h4 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">{item.title}</h4>
                                            <p className="text-gray-400 font-bold italic leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-10 bg-[#111811] border border-black text-primary rounded-[3rem] shadow-4xl flex items-start gap-8 group">
                                    <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-inner">
                                        <AlertTriangle size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Restocking Penalty</h4>
                                        <p className="text-gray-400 font-bold italic leading-relaxed">
                                            Bulk manifests and heavy machinery payloads may incur a 15% restoration fee. Coordinate with Pro Services for specialized extraction.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* How to Return Step Process */}
                        <section id="how-to" className="scroll-mt-[120px] space-y-16 animate-in fade-in duration-1000">
                            <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase flex items-center gap-6">
                                <div className="size-14 rounded-2xl bg-[#111811] text-primary flex items-center justify-center font-black italic group-hover:scale-110 transition-transform shadow-xl">03</div>
                                Return Interface
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative py-12">
                                <div className="hidden md:block absolute top-[80px] left-[10%] right-[10%] h-1 bg-gray-100 -z-10" />
                                {returnSteps.map((item) => (
                                    <div key={item.step} className="flex flex-col items-center text-center space-y-8 group">
                                        <div className="size-20 rounded-[28px] bg-white border border-gray-100 text-gray-400 flex items-center justify-center font-black text-3xl italic group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-110 transition-all duration-500 shadow-premium group-hover:shadow-4xl group-hover:shadow-primary/30">
                                            {String(item.step).padStart(2, '0')}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-black text-gray-900 italic uppercase tracking-tighter text-lg">{item.title}</p>
                                            <p className="text-sm text-gray-400 font-bold italic max-w-[180px]">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tactical Footer CTA */}
                        <section className="py-24 bg-gray-900 rounded-[5rem] p-12 md:p-20 text-center space-y-12 relative overflow-hidden shadow-4xl text-white">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-10">
                                <div className="size-20 bg-primary/20 rounded-[28px] flex items-center justify-center text-primary mx-auto border border-white/5 shadow-inner">
                                    <Globe size={40} className="animate-spin-slow" />
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                        Grid <span className="text-primary italic">Intelligence</span>
                                    </h2>
                                    <p className="text-gray-500 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed">
                                        Payload anomalies? Coordinates lost in transit? Access the intelligence grid or track your flow flow directly.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-8 justify-center pt-6">
                                    <Link to="/faq" className="h-20 px-16 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 flex items-center gap-4">
                                        Access FAQ Grid
                                    </Link>
                                    <Link to="/order-tracking" className="h-20 px-16 bg-white/5 text-white border border-white/10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all italic flex items-center gap-4">
                                        Track Order Flow
                                        <Navigation size={22} className="text-primary" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </article>
                </div>
            </main>

            {/* Simple Tactical Footer */}
            <footer className="py-24 text-center space-y-10 animate-in fade-in duration-1000 delay-1000">
                <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                    <Link to="/terms-of-use" className="hover:text-primary transition-colors">Tactical Terms</Link>
                    <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Node</Link>
                    <Link to="/contact" className="hover:text-primary transition-colors">Deploy Hub</Link>
                </div>
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.5em] italic">© T-VALUE . ALL FLOWS SECURED</p>
            </footer>
        </div>
    );
};

export default ShippingPolicyPage;
