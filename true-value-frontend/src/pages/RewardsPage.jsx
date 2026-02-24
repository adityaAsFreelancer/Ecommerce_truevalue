import React from 'react';
import {
    Gift, Star, Zap, CreditCard, History,
    ChevronRight, Sparkles, Award, ShieldCheck,
    Trophy, Wallet, ArrowUpRight, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import showAlert from '../utils/swal';
import { Link } from 'react-router-dom';

const RewardsPage = () => {
    const userRewards = {
        points: 2450,
        nextReward: 3000,
        tier: "Gold DIYer",
        status: "Pro Member",
        savingsToDate: 125.40,
        unlockedRewards: 3
    };

    const benefits = [
        { title: "Free Shipping", desc: "No minimums on thousands of items.", icon: <Zap /> },
        { title: "Birthday Gift", desc: "Annual ₹500 coupon on your special day.", icon: <Gift /> },
        { title: "Expert Support", desc: "Priority 24/7 DIY advice line.", icon: <Sparkles /> },
        { title: "Extended Returns", desc: "90-day stress-free return window.", icon: <ShieldCheck /> }
    ];

    const currentMissions = [
        { title: "Paint Project Master", points: 500, progress: 75, desc: "Buy 4 gallons of EasyCare paint." },
        { title: "Weekend Warrior", points: 200, progress: 100, desc: "Visit a store 3 times in a month.", completed: true },
        { title: "Reviewer Extraordinaire", points: 100, progress: 40, desc: "Write 5 product reviews." }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500">
            <HomeNavbar />

            <main className="flex-1 max-w-[1240px] mx-auto px-6 py-12 w-full space-y-16">
                {/* Rewards Dashboard */}
                <div
                    className="relative overflow-hidden rounded-[4rem] bg-[#111811] text-white p-10 md:p-20 shadow-4xl space-y-12 animate-in fade-in slide-in-from-top-8 duration-1000"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0" />

                    <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-16">
                        <div className="space-y-10 flex-1 w-full">
                            <div className="flex items-center gap-6">
                                <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-2xl shadow-primary/20 border border-primary/20">
                                    <Trophy size={40} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="px-5 py-1.5 bg-primary text-gray-900 text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl italic">
                                            {userRewards.tier}
                                        </span>
                                        <span className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">since 2022</span>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">True<span className="text-primary italic">Rewards</span></h1>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Accumulated Yield</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-6xl font-black text-primary tracking-tighter">{userRewards.points.toLocaleString()}</p>
                                        <span className="text-gray-500 font-bold mb-2 uppercase text-[10px] tracking-widest">pts</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Total Savings</p>
                                    <p className="text-6xl font-black tracking-tighter">₹{userRewards.savingsToDate.toLocaleString()}</p>
                                </div>
                                <div className="hidden lg:block space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Protocol Access</p>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                            <Award size={28} className="text-primary" />
                                        </div>
                                        <p className="text-2xl font-black tracking-tight italic uppercase text-white/90">{userRewards.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full xl:w-[450px] bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 p-10 space-y-8 shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-500">Next Node Unlocks at</h3>
                                        <p className="text-white text-3xl font-black italic tracking-tighter">{userRewards.nextReward.toLocaleString()} pts</p>
                                    </div>
                                    <span className="text-primary font-black italic text-sm">{Math.round((userRewards.points / userRewards.nextReward) * 100)}%</span>
                                </div>
                                <div className="h-6 bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(userRewards.points / userRewards.nextReward) * 100}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-primary rounded-full shadow-4xl shadow-primary/40 relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                    </motion.div>
                                </div>
                                <p className="text-[11px] text-gray-400 font-bold italic text-center px-4 leading-relaxed tracking-wider italic">Only {(userRewards.nextReward - userRewards.points).toLocaleString()} points away from transmitting your next ₹500 Voucher Protocol!</p>
                                <button
                                    onClick={() => showAlert({ title: "Protocol Initiated", text: "Transmitting reward vouchers to your vault...", icon: "success" })}
                                    className="w-full h-18 bg-white text-gray-900 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-white active:scale-95 transition-all shadow-3xl shadow-black/20"
                                >
                                    Access Reward Vault
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {benefits.map((benefit, idx) => (
                        <div
                            key={benefit.title}
                            className="bg-white border border-gray-100 p-10 rounded-[3.5rem] shadow-premium hover:shadow-4xl hover:-translate-y-2 transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner border border-gray-50 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {React.cloneElement(benefit.icon, { size: 28, strokeWidth: 2.5 })}
                            </div>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tighter leading-none mb-4 italic uppercase">{benefit.title}</h4>
                            <p className="text-sm text-gray-400 font-bold italic leading-relaxed">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Missions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-6 italic uppercase">
                                <Zap className="text-primary fill-current" size={32} />
                                Efficiency Missions
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {currentMissions.map((mission, idx) => (
                                <div
                                    key={mission.title}
                                    className="bg-white border border-gray-100 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-10 transition-all hover:shadow-premium group"
                                >
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="text-2xl font-black tracking-tighter leading-none italic uppercase text-gray-900 group-hover:text-primary transition-colors">{mission.title}</h4>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] italic mt-2">{mission.desc}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-primary tracking-tighter italic">+{mission.points}</span>
                                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">yield</p>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${mission.progress}%` }}
                                                className={`h-full rounded-full ${mission.completed ? 'bg-green-500' : 'bg-primary shadow-sm shadow-primary/20'}`}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        className={`h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all ${mission.completed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-[#111811] text-white hover:scale-105 active:scale-95 shadow-xl shadow-black/10'}`}
                                        disabled={mission.completed}
                                    >
                                        {mission.completed ? 'Validated' : 'Initiate Mission'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4 italic uppercase underline decoration-primary/30 underline-offset-[12px]">
                            Ledger
                        </h3>
                        <div className="bg-gray-900 rounded-[3.5rem] p-10 space-y-8 shadow-4xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                            <div className="space-y-8 relative z-10">
                                {[
                                    { title: "Manifest #TV-98231", date: "Today", pts: "+125" },
                                    { title: "Node Access Bonus", date: "Yesterday", pts: "+10" },
                                    { title: "Intel: EasyCare Paint", date: "Jan 15", pts: "+20" },
                                    { title: "Cycle Loyalty Bonus", date: "Jan 01", pts: "+100" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                        <div className="space-y-2">
                                            <p className="text-base font-black text-white tracking-tighter uppercase italic group-hover:text-primary transition-colors">{item.title}</p>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">{item.date}</p>
                                        </div>
                                        <span className="text-lg font-black text-primary tracking-tighter italic">{item.pts}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full pt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 flex items-center justify-center gap-3 hover:text-primary transition-colors group italic relative z-10">
                                Full Transmission Log
                                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Call to Action */}
                <div className="py-20 text-center space-y-8 animate-in fade-in duration-1000">
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 italic tracking-tighter uppercase">Ready to <span className="text-primary italic">Scale?</span></h2>
                    <p className="text-gray-400 text-lg font-bold italic max-w-2xl mx-auto">Every project adds to your DIY dominance. Keep building, keep saving.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-4 px-16 py-6 bg-primary text-white font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-4xl shadow-primary/30 uppercase tracking-[0.3em] text-xs"
                    >
                        Explore Catalog
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default RewardsPage;
