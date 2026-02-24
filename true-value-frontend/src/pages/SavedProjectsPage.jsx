import React, { useState } from 'react';
import {
    LayoutDashboard as DashboardIcon,
    Package as OrderIcon,
    FolderHeart as SavedIcon,
    MapPin as AddressIcon,
    CreditCard as PaymentIcon,
    History as HistoryIcon,
    Plus,
    PlusSquare,
    Search as SearchIcon,
    ShoppingCart as CartIcon,
    Edit3 as EditIcon,
    Eye as ViewIcon,
    PlusSquare as AddProjectIcon,
    ChevronDown,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    Tag,
    Trash2,
    List as ListAlt,
    ShoppingCart as AddShoppingCart,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';
import showAlert from '../utils/swal';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const SavedProjectsPage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user: authUser } = useUser();
    const [activeTab, setActiveTab] = useState('all');

    // User data derived from context or defaults
    const user = {
        name: authUser?.name || "Alex Johnson",
        avatar: authUser?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAJCdbgPupX2jcSTvBejp_p9K-Vzk7zbOLAKYIAKPrS8ZLlcUATrqK46-35U3W8CHnAZpEEH5KjP6QXaLKe5KsSsmaWtB-T23bttSTXGnVYyALP6CpG1Yy-KN1UpRbYGF47P74YRN6MI0u9hg-OYX0RMdqur2heokrwJf3JfutU1xx_VeT3l2Pq-iLgarVoCfVLTIYodKQJY6qB4fP1qtQX9a5lCwWni0NxFONAi7QmI30pDzqd6ZcVDcQnt0FVxNcHxZ3arHSe-xHu"
    };

    const projects = [
        {
            id: 1,
            name: "Living Room Refresh",
            category: "Painting",
            date: "Oct 24, 2023",
            cost: 145.20,
            status: "In Progress",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxuxPbSLNvjo5qMA4d22l-uKc36KBXZyS-PFKU1vJb0GCjpBrudL0D-SIFt_AEtpCnRoybubJ7FAETOSTVGMMcg-kHYMO0kyxca-4rG3qEyrjfxIlRr8VNV3bHLkTGb11RuM5tJTzF9jn6wUZnr46nmaOwCZaBPa1HRP_GUzra2OCc3uELPSmJNjPNl9N5TMJFifeJ3SbD1arQuKpCZCplxCVhqzDX3LAweDfcK3g1iDXISQlNBKPeuGBrujIWDtIzGBxQ3QR76jYr",
            items: [
                { id: 'p1', name: "Satin Latex Paint", price: 38.40, qty: 3 },
                { id: 'p2', name: "Roller Kit", price: 29.99, qty: 1 }
            ]
        },
        {
            id: 2,
            name: "Deck Restoration",
            category: "Outdoor",
            date: "Sep 12, 2023",
            cost: 1250.00,
            status: "Completed",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJbyBKxpe9gB6_CvUIe3QTqRcn7-kV_zJQn5iLsfglwTq0Js1afiXVBY6p3lLAntwQT03CVKZfc2wkze2gAkYGM5vMRctGOqxA6hz3-j-1DF9G55vhVhQK33sEMHA5F_KBsPfK4WcfROJSiqpMfN2E0nfJowXQ2h4vOg0IeLMhF9fH7INrMXkam-x82DKA4vRbH7ZuIsvtoQ0rWVLahsLR-adSVIrEuiMqltLQwaODNPVOapUgZ8k4XvwiO0rr5pTWPkvIbTYkU4I",
            items: [
                { id: 'd1', name: "Cedar Planks", price: 28.50, qty: 40 },
                { id: 'd2', name: "Deck Screws", price: 12.99, qty: 5 }
            ]
        },
        {
            id: 3,
            name: "Backsplash Tiling",
            category: "Kitchen",
            date: "Aug 02, 2023",
            cost: 342.15,
            status: "In Progress",
            alert: "PRICES CHANGED",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXRWyhKHZJhDFoQN2yVfC630geN68kTsm5TFpGxbmr-FfmjsdEcmRCW_kMrAm-MS8XXUV6Mm_OcbKTUr3jTRUnL2bVGk57hoC34FTUQsqcoe7R5E2O86DPtZv7MfeliotcunLE5TWJifOeT7pvTE7kneMSf93z5Nzfp2zAFtvGyyLjecfNmTUZEoQYLMx1EkEJoy7NGcOiNIbOK50o9N-YwvJ3pdYvwvByW_8WOGaFjfsWgDfRGyKAKpYYM0QDln00KGVcw1L-I-Du",
            items: [
                { id: 'k1', name: "Subway Tiles", price: 1.99, qty: 150 },
                { id: 'k2', name: "Tile Grout", price: 21.50, qty: 2 }
            ]
        }
    ];

    const recentlyViewed = [
        { id: 'r1', name: "Premium White Enamel", price: 45.99, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkZFITtlR9GqFb_Zvuwmhdu7sohh8RW3Kq3EVUg4R3H-PLP4wLi0qkIfhe4OqWxqugGVnR05M6p844rx0atodsKMZ9rkEIDV9eUdlgL_4TcC4FUYit0Ih5SmLc7VBytxZ0dXTUsU3GstQjXATKGwu5M-1y0zQUx2qisVkAmH7h7vGnKnxZ6CR22805Z82DriwTs2I2l0qh35bHEGHd4IZdME68FnLFWDqVkN9Cn9wVRx2jE_y24wojmkLzJfZ2Q2huSpwSwFpx9srO" },
        { id: 'r2', name: "Brushless Drill Kit", price: 129.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmOiNo98-zPnCbEFGqWJ_vmgpY5OvaZxFSXWewq4Q4h6nxuCAyYcq7aLsHkBQ8ENZ_o01cDwIJx71XIXv_MWXHoRC_mDIZwsjgS1mPEL47kWfDKwP1DTEFDC9DCuViI9zSbylbd_c720IP35P8gCEE1OgTocJr6jgQzS36XSwNLm5U8buQDaZxQIn6ohzccRJh5GbA4vEYtWaav7mhq59-zmB0kGjFJ6s97i12kaPfvyF1VRIbVyFreGOS_SvIibuVzbC10Ky1Dx1" },
        { id: 'r3', name: "Multi-Surface Tape", price: 8.49, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAQWRA4w-xq1agWt9EUMjXjfD-Urd09qluy9-qtmyOxPkhYNikAC-UmssrNM8L0j_6G6dYQV7jC0E5gsmfaYrHjFCraxqdmF9NqwPNmVSf44OvMZ1lqKPPNjoNok9WEgSNm07FdnjJ3gzoEPU_GpxG9CXHmBb6WVz55t6oIX8U0PEhV454nuXcpDTHKunnfkXsxW0KYmPcIJj-tT42c28yDDnoXXGqmiw4pFlOV0K70kRd-HSuK02C3M-IMlj-e4glioLwrN05705" },
        { id: 'r4', name: "1/2\" Copper Elbow", price: 3.25, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5F6Zy5or7744ayjgeMuVdJfIVOuamD9iU2FIsP0WRagMuZ3ti0KiC-e-om328k8yYxoaoRRFb3LgnpBZdhYH_63R1Maz2xUfnyr5o0D4CeYhh9iSMofS9u-aVL2UVzrzGrCKJiWIP3GCToGt8h2M7I7K8WHpreNTbvHRjulrX7d9kuTxNKGqlLBWoVrzJIHBNHowIrXy4BPGrR9zweElz17ceWySTKFW9-ee7PYAM1t8yg2dFyVQuwRDRepJLtquG9qXMP-VYX8d-" }
    ];

    const handleAddAllToCart = (project) => {
        project.items.forEach(item => addToCart(item, item.qty));
        showAlert({
            title: "Added All to Cart!",
            text: `Selected materials for "${project.name}" have been added to your shopping cart.`,
            icon: "success"
        });
    };

    const handleAction = (label) => {
        showAlert({ title: label, text: `Triggering ${label} protocol...`, icon: 'info' });
    };

    const filteredProjects = activeTab === 'all'
        ? projects
        : projects.filter(p => p.status.toLowerCase().includes(activeTab.toLowerCase()));

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500 selection:bg-primary/20">
            <HomeNavbar />

            <div className="flex-1 max-w-[1440px] mx-auto flex w-full relative">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:flex flex-col w-80 border-r border-gray-100 bg-white p-10 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto no-scrollbar">
                    <div className="flex flex-col gap-10">
                        <div className="flex gap-4 items-center animate-in slide-in-from-left-4 duration-700">
                            <div className="size-16 rounded-[24px] bg-cover bg-center border-2 border-primary/20 shadow-premium" style={{ backgroundImage: `url(${user.avatar})` }} />
                            <div className="flex flex-col">
                                <h2 className="text-gray-900 text-xl font-black tracking-tighter leading-none italic uppercase">{user.name.split(' ')[0]}</h2>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Logistics Pro</p>
                            </div>
                        </div>

                        <nav className="flex flex-col gap-3">
                            <Link to="/profile" className="flex items-center gap-4 px-6 py-4 rounded-[18px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all group group hover:scale-[1.02]">
                                <DashboardIcon size={20} className="group-hover:text-primary transition-colors" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Intelligence</span>
                            </Link>
                            <Link to="/order-tracking" className="flex items-center gap-4 px-6 py-4 rounded-[18px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all group hover:scale-[1.02]">
                                <OrderIcon size={20} className="group-hover:text-primary transition-colors" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Orders</span>
                            </Link>
                            <Link to="/saved-projects" className="flex items-center gap-4 px-6 py-4 rounded-[18px] bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5 group scale-[1.05]">
                                <SavedIcon size={20} className="fill-current" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Saved Ops</span>
                            </Link>
                            <Link to="/addresses" className="flex items-center gap-4 px-6 py-4 rounded-[18px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all group hover:scale-[1.02]">
                                <AddressIcon size={20} className="group-hover:text-primary transition-colors" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Deployments</span>
                            </Link>
                            <button onClick={() => handleAction('Payment Methods')} className="flex items-center gap-4 px-6 py-4 rounded-[18px] text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all group hover:scale-[1.02]">
                                <PaymentIcon size={20} className="group-hover:text-primary transition-colors" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Settlements</span>
                            </button>
                        </nav>

                        <div className="p-8 bg-gray-900 rounded-[32px] text-white space-y-4 relative overflow-hidden group shadow-3xl">
                            <div className="absolute -top-10 -right-10 size-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Efficiency protocol</p>
                            <p className="text-xs text-gray-300 font-bold leading-relaxed italic relative z-10">
                                Consolidating your saved manifests can optimize logistic yields by 15%.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
                    <div className="p-8 lg:p-16 space-y-16">
                        {/* Page Heading */}
                        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12" data-aos="fade-down">
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-6 duration-1000">
                                <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">Saved<span className="text-primary italic">Ops</span></h1>
                                <p className="text-gray-400 text-xl font-bold max-w-2xl italic leading-relaxed">
                                    Strategic project blueprints, material manifests, and logistical estimations. Initialize your next build.
                                </p>
                            </div>
                            <Link
                                to="/calculator"
                                className="h-20 px-12 bg-[#111811] text-white font-black rounded-[28px] flex items-center justify-center gap-4 hover:scale-[1.05] active:scale-95 transition-all shadow-4xl shadow-black/20 group animate-in fade-in slide-in-from-right-8 duration-1000"
                            >
                                <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform text-primary" />
                                <span className="uppercase tracking-[0.25em] text-xs font-black">Design Blueprint</span>
                            </Link>
                        </div>

                        {/* Tabs & Filters */}
                        <div className="space-y-10 animate-in fade-in duration-1000 delay-300">
                            <div className="flex border-b border-gray-100 gap-12 overflow-x-auto no-scrollbar">
                                {['all', 'progress', 'completed'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative shrink-0 ${activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab === 'all' ? `Global Log (${projects.length})` : tab === 'progress' ? 'Active Cycles' : 'Validated'}
                                        {activeTab === tab && <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-t-full shadow-lg shadow-primary/30" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button className="h-14 px-8 rounded-2xl bg-white border border-gray-100 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all shadow-premium group">
                                    <Tag size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                    Filter: Category
                                </button>
                                <button className="h-14 px-8 rounded-2xl bg-white border border-gray-100 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all shadow-premium group">
                                    <ArrowUpDown size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                    Order: Temporal
                                </button>
                            </div>
                        </div>

                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 pb-16">
                            <AnimatePresence mode="popLayout">
                                {filteredProjects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                                        className="bg-white rounded-[48px] border border-gray-50 shadow-premium hover:shadow-4xl transition-all group overflow-hidden"
                                    >
                                        <div className="h-64 relative overflow-hidden">
                                            <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            <div className="absolute top-8 left-8 flex gap-3">
                                                <div className="bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-[20px] text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-gray-900 shadow-3xl border border-white/20">
                                                    <span className={`size-2 rounded-full ${project.status === 'Completed' ? 'bg-gray-300' : 'bg-primary animate-pulse'}`} />
                                                    {project.category}
                                                </div>
                                            </div>
                                            {project.alert && (
                                                <div className="absolute top-8 right-8 bg-gray-900 text-white text-[9px] font-black px-4 py-2 rounded-[20px] shadow-3xl shadow-gray-900/30 uppercase tracking-widest italic animate-bounce">
                                                    {project.alert}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-10 space-y-10">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-3">
                                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic uppercase group-hover:text-primary transition-colors">{project.name}</h3>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] italic">Timestamp: {project.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-4xl font-black text-primary tracking-tighter italic">₹{(project.cost * 80).toLocaleString()}</p>
                                                    <p className="text-[10px] text-gray-300 uppercase font-black tracking-[0.4em]">Yield Est.</p>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50/50 p-8 rounded-[36px] border border-gray-100 space-y-6 shadow-inner">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <ListAlt size={18} className="text-primary" />
                                                        Material Ledger ({project.items.length * 2}+)
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.items.map((item, i) => (
                                                        <span key={i} className="text-[10px] font-black text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm uppercase tracking-tight italic">
                                                            {item.qty}x {item.name}
                                                        </span>
                                                    ))}
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 tracking-tight italic">
                                                        +2 SECURE
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-6">
                                                <button
                                                    onClick={() => handleAddAllToCart(project)}
                                                    className="flex-1 h-18 bg-primary text-white font-black rounded-[24px] flex items-center justify-center gap-4 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all shadow-4xl shadow-primary/30 text-[10px] uppercase tracking-[0.3em]"
                                                >
                                                    <AddShoppingCart size={22} className="stroke-[2.5]" />
                                                    Transmit to Cart
                                                </button>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleAction('Edit')} className="size-18 rounded-[24px] border border-gray-100 flex items-center justify-center text-gray-300 hover:text-primary hover:bg-white hover:shadow-xl transition-all group active:scale-90">
                                                        <EditIcon size={22} />
                                                    </button>
                                                    <button onClick={() => handleAction('View')} className="size-18 rounded-[24px] border border-gray-100 flex items-center justify-center text-gray-300 hover:text-primary hover:bg-white hover:shadow-xl transition-all group active:scale-90">
                                                        <ViewIcon size={22} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Start New Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative"
                            >
                                <Link
                                    to="/calculator"
                                    className="flex flex-col items-center justify-center gap-10 p-16 rounded-[48px] border-4 border-dashed border-gray-100 hover:bg-white hover:border-primary/30 hover:shadow-4xl transition-all min-h-[500px] group bg-gray-50/30"
                                >
                                    <div className="size-28 rounded-[40px] bg-white flex items-center justify-center text-gray-200 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-700 shadow-2xl border border-gray-50">
                                        <AddProjectIcon size={56} strokeWidth={1} />
                                    </div>
                                    <div className="text-center space-y-4">
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Blueprint Node</h3>
                                        <p className="text-gray-400 font-bold italic text-sm max-w-[280px] leading-relaxed">Initialize a new secure material estimation for your next deployment.</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                                        Start Session <ArrowRight size={16} />
                                    </div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Recently Viewed */}
                        <section className="p-10 lg:p-20 bg-gray-900 rounded-[64px] border border-white/5 space-y-12 shadow-4xl relative overflow-hidden mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000" data-aos="fade-up">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-6">
                                    <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                        <HistoryIcon size={32} />
                                    </div>
                                    Intel Cache
                                </h2>
                                <Link to="/products" className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors group flex items-center gap-2">
                                    Explore Fleet Store <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 relative z-10">
                                {recentlyViewed.map(item => (
                                    <Link key={item.id} to={`/products/${item.id}`} className="flex flex-col gap-6 group">
                                        <div className="aspect-square rounded-[32px] bg-white/5 overflow-hidden border border-white/10 group-hover:border-primary/50 group-hover:shadow-4xl transition-all duration-700 relative">
                                            <img src={item.img} alt={item.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-black text-white truncate uppercase tracking-widest italic leading-none group-hover:text-primary transition-colors">{item.name}</p>
                                            <p className="text-2xl font-black text-primary tracking-tighter leading-none italic">₹{(item.price * 80).toLocaleString()}</p>
                                        </div>
                                    </Link>
                                ))}
                                <Link
                                    to="/products"
                                    className="aspect-square rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-white/5 transition-all group"
                                >
                                    <Plus size={40} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full Intel</span>
                                </Link>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SavedProjectsPage;
