import React, { useState, useEffect } from 'react';
// Using Lucide React icons for consistency with our design system
import {
    Hammer, Search as SearchIcon, ShoppingCart as CartIcon,
    Heart, Upload, ChevronDown, Plus, Star, CheckCircle2,
    MessageSquare, Eye, Filter, ArrowRight, BookOpen,
    ShoppingCart as AddShoppingCart,
    FileUp as UploadFile, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import showAlert from '../utils/swal';
import { useCart } from '../context/CartContext';

const ProjectGalleryPage = () => {
    const { addToCart } = useCart();
    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [projectStates, setProjectStates] = useState({});
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('tv_gallery_projects');
        if (saved) {
            setProjects(JSON.parse(saved));
        } else {
            setProjects(initialProjects);
        }
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('tv_gallery_projects', JSON.stringify(projects));
        }
    }, [projects]);

    const userProfile = {
        name: "Alex",
        fullName: "Alex Johnson",
        memberSince: "2022",
        stats: "12 Projects Shared • 45 Helpful Votes • Pro Member",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJCdbgPupX2jcSTvBejp_p9K-Vzk7zbOLAKYIAKPrS8ZLlcUATrqK46-35U3W8CHnAZpEEH5KjP6QXaLKe5KsSsmaWtB-T23bttSTXGnVYyALP6CpG1Yy-KN1UpRbYGF47P74YRN6MI0u9hg-OYX0RMdqur2heokrwJf3JfutU1xx_VeT3l2Pq-iLgarVoCfVLTIYodKQJY6qB4fP1qtQX9a5lCwWni0NxFONAi7QmI30pDzqd6ZcVDcQnt0FVxNcHxZ3arHSe-xHu",
        tags: ["Kitchen Expert", "Gardener"]
    };

    const filters = [
        "All Projects", "Kitchen", "Painting", "Gardening", "Electrical"
    ];

    const initialProjects = [
        {
            id: 1,
            title: "Kitchen Cabinet Refacing",
            time: "2 days ago",
            desc: "Transformed my dated 90s kitchen with midnight blue paint and brushed gold hardware. Total cost under $200!",
            category: "Kitchen",
            beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnioglDlUijDWkhZ8bs_kYbeLZGjj4jhKXxigZHw6kLGo8SvIl81TvIPuQWaQWuSykyGxIxiC7lqsW3zgYz2l0TT6WyFkVsPn6P5Fdl7I5RtEagMbKA7fxy3BzBiXM6_ilWzh7tVYtzxJRuebmGOWH1NDoQcVqBNM5oJ_mo_PIsOuiguWM26hJd9SBJzdXVmPEphDGHQRIojPpUtRqm7gafeeOiJhZ27dY5H6xCXzm3Yh5qW9xI_TxUDnEyxySgEM9V58NF2CroEYL",
            afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnioglDlUijDWkhZ8bs_kYbeLZGjj4jhKXxigZHw6kLGo8SvIl81TvIPuQWaQWuSykyGxIxiC7lqsW3zgYz2l0TT6WyFkVsPn6P5Fdl7I5RtEagMbKA7fxy3BzBiXM6_ilWzh7tVYtzxJRuebmGOWH1NDoQcVqBNM5oJ_mo_PIsOuiguWM26hJd9SBJzdXVmPEphDGHQRIojPpUtRqm7gafeeOiJhZ27dY5H6xCXzm3Yh5qW9xI_TxUDnEyxySgEM9V58NF2CroEYL",
            products: [
                { id: 'paint1', name: "EasyCare Ultra Paint", price: 42.99, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArfRoaHw8GZuX9W3Z5E2_2KiAlcHkYTyiAQ1Bf5makZch9zGGdzwWVuzXsD4dz4LmN0QU68v6XpZeKqouIqz6GbKuBrXAVweqE29pVAI7YW_HGUohDieitRRu_2zYfy_EW1TWElVG1GXyYhpXQGOdX_pT6lNbL-2Xm_u68GWXKxPsTnNDCwu9dv-P3YaKMZUrv3dXOXXYgmNtxuORbscFnGt6mqqFXSJ1AaCpOKYnIxcriJjPWJs-m5VRfS1zz6lR0YBDocYMYKhZS" },
                { id: 'pulls1', name: "Brushed Gold Pulls", price: 5.49, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIpZi86kmyQWwPROp5XgYbLAGOtIhGPnmenkaTE92e2MruochHw9uIN1iRw6Jv1ytjhn82ECQEqSxuNefn2x89lF4XVXbUVldegUJXACtfsWbTyXys_KArW6eFF-3TOT0Nxi7F2c4l9KY1GzaRcehH3lZVKyHuINNOD0hnJGuLRq8espiJ14lqOjSwrjky3rXHKXqHKzQ158zBwm5Q-AHWnSDBDz1T65-bVZ6ixvRC0Srj2EvZUJLI2H93XyZ-4hE-vf3rVcH6D6Cp" }
            ]
        },
        {
            id: 2,
            title: "Backyard Deck Revive",
            time: "1 week ago",
            desc: "Stripped the old peeling gray paint and applied a rich cedar semi-transparent stain. Looks brand new!",
            category: "Gardening",
            afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHqFpuxFsg2FpEfZlt7u5zwl3d5CTtunjYUKi5oBekFxlE2HzDGtKpzJ2qVSumMfXICmNKHOQpBv46qKgXlaMDpJ8ppxE0ATNPLPPdbywcaWz6-YVRMQ8ejUm21aHsy4v3diPryTvuMrSPIGyR1bjLx9PLnoP-DRxIxlzhtNZZSwYEJFQis7YBOpcWjEsq0HNeAuRsCBMUUp_1Jjvf0nPlVBDjxdQ5XVsZXqk205wJeymWCxVQ38vP1L7mNE5FVqGJ15tvIdXr2LHE",
            beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHqFpuxFsg2FpEfZlt7u5zwl3d5CTtunjYUKi5oBekFxlE2HzDGtKpzJ2qVSumMfXICmNKHOQpBv46qKgXlaMDpJ8ppxE0ATNPLPPdbywcaWz6-YVRMQ8ejUm21aHsy4v3diPryTvuMrSPIGyR1bjLx9PLnoP-DRxIxlzhtNZZSwYEJFQis7YBOpcWjEsq0HNeAuRsCBMUUp_1Jjvf0nPlVBDjxdQ5XVsZXqk205wJeymWCxVQ38vP1L7mNE5FVqGJ15tvIdXr2LHE",
            products: [
                { id: 'stain1', name: "Wood Defender Cedar", price: 58.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTXTlZ5wa63l9M3WuPLFn-Z4pFOJJaFUk7T8XNd-X9RIhteJkm-9mm1iMitk2hg1zX5g4F-JeXd3qvShHjNfTxxzSSGkr2hfAbWppZvI4T6KBRb1GXyAFkTRdTwHACK_PEwPbJybGZ6JdtvBoERiJVRr1mqsQbwe-9sIHkspfcYUDkcWZhpdVIkFeRLTthnAC63dLROcON-xYVkYayftQB9jgZIolDtoBExERKzaQpiHtE8HpBmHDR4dDZ5LnU9izGaV2G2o7QFrIv" }
            ]
        },
        {
            id: 3,
            title: "Geometric Accent Wall",
            time: "3 weeks ago",
            desc: "Used pine furring strips and a miter saw to create this custom statement wall in my home office.",
            category: "Painting",
            afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3t-u1pOCkPmCOhhrFL6NQvRMnKpl0i72Rw4GmgxadUjlr8tKpdPUKhI1LMesYOk-ubgxzR-ospf_R2gMgS9iNXeYgMcUajl8OZSOqJmy_HwrZmRUfhdN85D5x9ggMM86vR4g0uOSOlzPa2kiWfAHJtBabMkgYZpSIUHOJ3IIMy80zQ6kKpn1izg1d5zeqQ205G-iDcI62sZORJ6h3hHBHVag-fTqaTVlaZo6q3srB6eWJgWoWYW86Pdqk4l-wi6SGqxcUjglNmJ4Y",
            beforeImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3t-u1pOCkPmCOhhrFL6NQvRMnKpl0i72Rw4GmgxadUjlr8tKpdPUKhI1LMesYOk-ubgxzR-ospf_R2gMgS9iNXeYgMcUajl8OZSOqJmy_HwrZmRUfhdN85D5x9ggMM86vR4g0uOSOlzPa2kiWfAHJtBabMkgYZpSIUHOJ3IIMy80zQ6kKpn1izg1d5zeqQ205G-iDcI62sZORJ6h3hHBHVag-fTqaTVlaZo6q3srB6eWJgWoWYW86Pdqk4l-wi6SGqxcUjglNmJ4Y",
            products: [
                { id: 'nailer1', name: "Pneumatic Brad Nailer", price: 129.00, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGftsJepLtVhIPklPPrTKKoY6ioIUyWhOh36yvZkrRnbyNI76Ctb-5x0KPj7ITsZV-wcoMsbu7QCENMEmakwyUZDypB5RgeXxrduVcqu0GhYnu9VTje181nq0IfCexyKLnkbPbwx4fGVkjgLBg2AOHA8-ClM4rRAn1eXK43jsT4_ejVE-AZnf5AO9ixLrmQtxN-jUcQ92GelnNKEoz2nJ3CAQO8Q4JYCthiY39OsvRElpWGLGW_ct6dwsJ517eY9uPO8iUDznAEZff" }
            ]
        }
    ];

    const toggleProject = (id, state) => {
        setProjectStates(prev => ({ ...prev, [id]: state }));
    };

    const handleUploadClick = () => {
        showAlert({
            title: "Upload Project",
            text: "This would open a multi-step form. For now, we'll simulate adding a new community project!",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Simulate Upload"
        }).then((result) => {
            if (result.isConfirmed) {
                const newProj = {
                    id: Date.now(),
                    title: "Modern Patio Set",
                    time: "Just now",
                    desc: "Built a custom cedar patio set and stained it with Wood Defender. Total weekend project!",
                    category: "Gardening",
                    afterImage: "https://images.unsplash.com/photo-1590059132718-59219e796616?auto=format&fit=crop&w=800&q=80",
                    beforeImage: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&q=80",
                    products: [
                        { id: 'wood1', name: "Premium Cedar Lumber", price: 120.00, img: "https://images.unsplash.com/photo-1589133481634-19266ad8563c?auto=format&fit=crop&w=200&q=200" }
                    ]
                };
                setProjects([newProj, ...projects]);
                showAlert({ title: "Success!", text: "Your project has been shared with the community.", icon: "success" });
            }
        });
    };

    const handleAddToCartItem = (item) => {
        addToCart(item, 1);
        showAlert({
            title: "Added!",
            text: `${item.name} added to cart.`,
            icon: "success",
            toast: true,
            position: 'top-end',
            timer: 2000,
            showConfirmButton: false
        });
    };

    const filteredProjects = activeFilter === 'All Projects'
        ? projects
        : projects.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen bg-gray-50 font-display flex flex-col transition-colors duration-500">
            <HomeNavbar />

            <main className="max-w-[1240px] mx-auto px-6 py-12 w-full space-y-12">
                {/* Profile Header */}
                <div
                    className="flex flex-col md:flex-row md:items-center justify-between gap-10 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50"
                    data-aos="fade-down"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                        <div className="relative group">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-primary/20 shadow-2xl transition-transform group-hover:scale-105 duration-500" style={{ backgroundImage: `url(${userProfile.avatar})` }} />
                            <div className="absolute -bottom-2 -right-2 bg-primary text-gray-900 p-2 rounded-xl shadow-lg animate-bounce">
                                <Star size={20} fill="currentColor" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{userProfile.name}'s DIY Journey</h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">{userProfile.stats}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {userProfile.tags.map(tag => (
                                    <span key={tag} className="px-5 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm border border-primary/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleUploadClick}
                        className="flex items-center justify-center gap-3 h-16 px-10 bg-[#111811] text-white font-black rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/20 group"
                    >
                        <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                        <span className="uppercase tracking-widest text-sm">Upload New Project</span>
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar" data-aos="fade-up">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex h-12 shrink-0 items-center justify-center px-8 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-sm ${activeFilter === filter ? 'bg-primary text-gray-900 shadow-primary/30' : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'}`}
                        >
                            {filter}
                            {filter !== "All Projects" && <ChevronDown size={14} className="ml-2 opacity-50" />}
                        </button>
                    ))}
                </div>

                {/* Project Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project, idx) => {
                            const isAfter = projectStates[project.id] !== 'Before';
                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all h-full"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={isAfter ? 'after' : 'before'}
                                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                                exit={{ opacity: 0, filter: 'blur(10px)' }}
                                                src={isAfter ? project.afterImage : project.beforeImage}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                                                alt={project.title}
                                            />
                                        </AnimatePresence>

                                        {/* Toggle Controls */}
                                        <div className="absolute top-6 left-6 z-20">
                                            <div className="flex h-12 items-center rounded-2xl bg-[#111811]/60 backdrop-blur-xl p-1.5 border border-white/10 shadow-2xl">
                                                <button
                                                    onClick={() => toggleProject(project.id, 'Before')}
                                                    className={`h-full px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isAfter ? 'bg-white text-gray-900 shadow-lg' : 'text-white/60 hover:text-white'}`}
                                                >
                                                    Before
                                                </button>
                                                <button
                                                    onClick={() => toggleProject(project.id, 'After')}
                                                    className={`h-full px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAfter ? 'bg-primary text-gray-900 shadow-lg shadow-primary/20' : 'text-white/60 hover:text-white'}`}
                                                >
                                                    After
                                                </button>
                                            </div>
                                        </div>

                                        <button className="absolute top-6 right-6 z-20 size-12 flex items-center justify-center rounded-2xl bg-[#111811]/60 backdrop-blur-xl text-white hover:text-primary border border-white/10 transition-all shadow-2xl active:scale-90">
                                            <Heart size={20} />
                                        </button>

                                        {/* Category Badge */}
                                        <div className="absolute bottom-6 left-6 z-20">
                                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-gray-900 shadow-xl">
                                                {project.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{project.title}</h3>
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{project.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed italic font-medium">
                                                "{project.desc}"
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Tag size={12} className="text-primary" />
                                                    Products Used ({project.products.length})
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {project.products.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between group/item p-3 rounded-2xl hover:bg-gray-50 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="size-14 rounded-xl bg-gray-100 overflow-hidden shadow-sm">
                                                                <img src={item.img} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform" alt={item.name} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-black text-gray-900 tracking-tight leading-none mb-1 uppercase italic">{item.name}</span>
                                                                <span className="text-lg font-black text-primary tracking-tighter">${item.price}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddToCartItem(item)}
                                                            className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4">
                                            <div className="flex items-center -space-x-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="size-8 rounded-full border-2 border-white bg-gray-200" />
                                                ))}
                                                <span className="text-[10px] text-gray-400 font-black ml-4">+24 others liked</span>
                                            </div>
                                            <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                                                Full Guide
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                <div className="flex justify-center pt-16">
                    <button className="h-16 px-12 bg-white border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-primary hover:border-primary transition-all shadow-xl shadow-gray-200/50 italic">
                        Load More Projects
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProjectGalleryPage;
