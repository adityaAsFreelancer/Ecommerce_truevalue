import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2,
    Image as ImageIcon, ToggleLeft, ToggleRight,
    ArrowUp, ArrowDown, Layout, Tag, Megaphone
} from 'lucide-react';
import { api } from '../../utils/api';
import showAlert from '../../utils/swal';
import { useUser } from '../../context/UserContext';

const AdminBannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBanners = async () => {
        if (user?.role !== 'admin') {
            console.warn('ADMIN_BANNER_MANAGER: Unauthorized access attempt blocked in component.');
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await api('/banners');
            setBanners(response.data || response);
        } catch (error) {
            console.error('Fetch Banners Error:', error);
            showAlert({ title: 'Error', text: 'Failed to fetch banner data.', icon: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleCreateBanner = () => {
        showAlert({
            title: 'Deploy New Banner',
            html: `
                <div class="space-y-4 text-left">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Banner Title</label>
                        <input id="swal-title" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Headline">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subtitle / Description</label>
                        <input id="swal-subtitle" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Detailed Tagline">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Image URL</label>
                        <input id="swal-image" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="https://...">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Type</label>
                            <select id="swal-type" class="swal2-select !w-full !m-0 !rounded-xl !border-2 !border-gray-100 !text-sm !font-bold">
                                <option value="hero">Hero Slider</option>
                                <option value="offer">Small Offer</option>
                                <option value="side">Side Promo</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Priority (Higher First)</label>
                            <input id="swal-priority" type="number" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" value="0">
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Deploy',
            preConfirm: () => {
                const title = document.getElementById('swal-title').value;
                const image = document.getElementById('swal-image').value;
                if (!title || !image) {
                    showAlert.showValidationMessage('Title and Image URL are required');
                    return false;
                }
                return {
                    title,
                    subtitle: document.getElementById('swal-subtitle').value,
                    image,
                    type: document.getElementById('swal-type').value,
                    priority: parseInt(document.getElementById('swal-priority').value)
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api('/banners', { method: 'POST', body: JSON.stringify(result.value) });
                    showAlert({ title: 'Success', text: 'Banner deployed successfully!', icon: 'success' });
                    fetchBanners();
                } catch (error) {
                    showAlert({ title: 'Error', text: 'Deployment failed', icon: 'error' });
                }
            }
        });
    };

    const handleToggleStatus = async (banner) => {
        try {
            await api(`/banners/${banner._id}`, {
                method: 'PUT',
                body: JSON.stringify({ isActive: !banner.isActive })
            });
            fetchBanners();
        } catch (error) {
            showAlert({ title: 'Error', text: 'Status update failed', icon: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const confirmed = await showAlert.confirm({
            title: 'Terminate Banner?',
            text: "This will remove the promotion from the frontend immediately.",
            icon: 'warning'
        });

        if (confirmed) {
            try {
                await api(`/banners/${id}`, { method: 'DELETE' });
                showAlert({ title: 'Removed', text: 'Banner has been terminated.', icon: 'success' });
                fetchBanners();
            } catch (error) {
                showAlert({ title: 'Error', text: 'Termination failed', icon: 'error' });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Promotions Hub</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live Banners & Flash Offers</p>
                </div>
                <button
                    onClick={handleCreateBanner}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                    <Plus size={18} strokeWidth={3} />
                    Deploy Promotion
                </button>
            </div>

            {/* Banner Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-[32px] animate-pulse" />
                    ))
                ) : banners.length === 0 ? (
                    <div className="lg:col-span-2 py-20 bg-white rounded-[40px] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                        <Megaphone size={48} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No promotions currently active</p>
                    </div>
                ) : banners.map((banner) => (
                    <div key={banner._id} className="group bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden flex flex-col relative">
                        <div className="relative h-48 overflow-hidden">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md ${banner.type === 'hero' ? 'bg-primary/80' : 'bg-orange-500/80'}`}>
                                    {banner.type}
                                </span>
                                {banner.isActive ? (
                                    <span className="px-3 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white">Live</span>
                                ) : (
                                    <span className="px-3 py-1 rounded-lg bg-gray-500/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-white">Draft</span>
                                )}
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase italic">{banner.title}</h3>
                                <p className="text-sm text-gray-500 font-medium line-clamp-1">{banner.subtitle}</p>
                            </div>

                            <div className="pt-6 flex items-center justify-between border-t border-gray-50 mt-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <ArrowUp size={14} className="text-gray-400" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority {banner.priority}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(banner)}
                                        className={`p-2.5 rounded-xl transition-all ${banner.isActive ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}
                                    >
                                        {banner.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    </button>
                                    <button onClick={() => handleDelete(banner._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBannerManager;
