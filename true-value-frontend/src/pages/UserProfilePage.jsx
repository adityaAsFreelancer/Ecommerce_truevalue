import React, { useState, useEffect } from 'react';
import {
    User, Package, MapPin, CreditCard, Heart, Settings,
    LogOut, Edit3, ChevronRight,
    Headset, Receipt, ShieldCheck,
    Lock, ArrowRight, Camera, Home, Plus, Mail, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeNavbar from '../components/home/HomeNavbar';
import showAlert from '../utils/swal';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const UserProfilePage = () => {
    const { user, logout, orders, updateUser, uploadAvatar } = useUser();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('profile');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    // Derived Data (Safe Scope)
    const safeOrders = orders || [];
    const recentOrders = safeOrders.slice(0, 3);
    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: User, color: 'text-blue-500' },
        { id: 'orders', label: 'My Orders', icon: Package, color: 'text-orange-500' },
        { id: 'addresses', label: 'Addresses', icon: MapPin, path: '/addresses', color: 'text-red-500' },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard, color: 'text-emerald-500' },
        { id: 'wishlist', label: 'My Wishlist', icon: Heart, path: '/wishlist', color: 'text-pink-500' },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showAlert({ title: 'Error', text: 'Please select an image file', icon: 'error' });
            return;
        }

        setUploading(true);
        try {
            await uploadAvatar(file);
            showAlert({ title: 'Success', text: 'Avatar updated!', icon: 'success', timer: 1500 });
        } catch (error) {
            showAlert({ title: 'Error', text: error.message, icon: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleEditProfile = () => {
        showAlert({
            title: 'Update Profile',
            html: `
                <div class="space-y-4 text-left">
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                        <input id="swal-name" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Full Name" value="${user?.name || ''}">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <input id="swal-email" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Email" value="${user?.email || ''}">
                    </div>
                    <div class="space-y-1">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                        <input id="swal-phone" class="swal2-input !mt-0 !w-full !rounded-xl !border-2 !border-gray-100 focus:!border-primary transition-all font-bold" placeholder="Phone" value="${user?.phone || ''}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save Changes',
            customClass: {
                popup: 'rounded-[32px] border-none shadow-2xl',
                confirmButton: 'bg-primary rounded-xl px-8 py-3 font-black uppercase tracking-widest text-xs',
                cancelButton: 'bg-gray-100 rounded-xl px-8 py-3 font-black uppercase tracking-widest text-xs text-gray-500'
            },
            preConfirm: () => {
                const name = document.getElementById('swal-name')?.value.trim();
                const email = document.getElementById('swal-email')?.value.trim();
                const phone = document.getElementById('swal-phone')?.value.trim();

                // Professional Validation
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

                if (!name || name.length < 3) {
                    showAlert.showValidationMessage('Name must be at least 3 characters');
                    return false;
                }
                if (!email || !emailRegex.test(email)) {
                    showAlert.showValidationMessage('Please enter a valid email address');
                    return false;
                }
                return { name, email, phone };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateUser(result.value);
                    showAlert({ title: 'Success', text: 'Profile updated successfully!', icon: 'success', timer: 1500 });
                } catch (error) {
                    showAlert({ title: 'Error', text: error.message || 'Update failed', icon: 'error' });
                }
            }
        });
    };

    const handleAction = (label) => {
        if (label === 'Edit Profile' || label === 'Edit Personal Info') {
            handleEditProfile();
            return;
        }
        showAlert({
            title: label,
            text: `Entering ${label} workflow...`,
            icon: 'info'
        });
    };

    const handleLogout = async () => {
        const result = await showAlert({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await logout();
                navigate('/');
            } catch (error) {
                console.error("Logout Error:", error);
                navigate('/'); // Navigate anyway if session is broken
            }
        }
    };

    return (
        <div className="min-h-screen bg-white font-display flex flex-col selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-10 w-full mb-24">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-premium sticky top-28">
                            <div className="flex flex-col items-center gap-6 py-6 border-b border-gray-100">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <div
                                        className={`size-28 rounded-full bg-cover bg-center border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500 bg-gray-100 ${uploading ? 'opacity-50 grayscale' : ''}`}
                                        style={{ backgroundImage: `url(${user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'})` }}
                                    />
                                    <div className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full border-4 border-white shadow-lg">
                                        <Camera size={14} className={uploading ? 'animate-pulse' : ''} />
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name || 'User'}</h3>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{user?.level || 'Member'}</p>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-3 mt-8">
                                {menuItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.path) navigate(item.path);
                                            else setActiveTab(item.id);
                                        }}
                                        className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                            ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                            : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-100'
                                            }`}
                                    >
                                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : `${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                                        <span className="text-sm font-black tracking-wide uppercase">
                                            {item.label}
                                        </span>
                                        {activeTab === item.id && (
                                            <ChevronRight size={16} className="ml-auto text-white" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <div className="pt-8 mt-8 border-t border-gray-100 space-y-3">
                                <button
                                    onClick={() => handleAction('Settings')}
                                    className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all font-black text-xs uppercase tracking-widest"
                                >
                                    <Settings size={20} className="text-gray-400" />
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-4 px-6 py-4 rounded-2xl w-full text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-black text-xs uppercase tracking-widest"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col gap-12 animate-in fade-in slide-in-from-right-4 duration-700">

                        {activeTab === 'profile' && (
                            <>
                                {/* Profile Hero */}
                                <section className="bg-white p-10 md:p-14 rounded-[48px] border border-gray-100 shadow-premium relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-1000" />
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                        <div className="space-y-4">
                                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                                                Welcome back, <br />
                                                <span className="text-primary">{user?.name?.split(' ')?.[0] || 'User'}</span>
                                            </h2>
                                            <p className="text-gray-400 font-medium max-w-lg text-lg leading-relaxed">Manage your profile, check your orders, and update your account settings from this dashboard.</p>
                                        </div>
                                        <button
                                            onClick={() => handleAction('Edit Profile')}
                                            className="px-10 py-5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-2xl shadow-gray-900/10 active:scale-95 cursor-pointer"
                                        >
                                            Update Profile
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6 hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-premium text-2xl font-black">
                                                {user?.level?.charAt(0) || 'L'}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Loyalty Level</p>
                                                <p className="text-gray-900 font-black text-xl tracking-tight">{user?.level || 'Member'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6 hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-premium">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Joined</p>
                                                <p className="text-gray-900 font-black text-xl tracking-tight">{user?.memberSince || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100 flex items-center gap-6 hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-primary shadow-premium">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Orders</p>
                                                <p className="text-gray-900 font-black text-xl tracking-tight">{safeOrders.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Account Details */}
                                    <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden hover:shadow-2xl transition-all duration-500">
                                        <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/30">
                                            <h4 className="text-gray-900 font-black uppercase tracking-widest text-xs">Personal Information</h4>
                                            <button onClick={() => handleAction('Edit Personal Info')} className="text-gray-400 hover:text-primary transition-colors p-2.5 hover:bg-white rounded-xl shadow-sm">
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                        <div className="p-10 space-y-8">
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary">
                                                    <Mail size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Email Address</p>
                                                    <p className="text-gray-900 font-black text-sm">{user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                                    <Headset size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Phone Contact</p>
                                                    <p className="text-gray-900 font-black text-sm">{user?.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                                    <Lock size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">Security</p>
                                                    <p className="text-gray-900 font-black text-sm">•••• •••• ••••</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Primary Address */}
                                    <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                                        <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/30">
                                            <h4 className="text-gray-900 font-black uppercase tracking-widest text-xs">Shipping Address</h4>
                                            <Link to="/addresses" className="text-gray-400 hover:text-primary transition-colors p-2.5 hover:bg-white rounded-xl shadow-sm">
                                                <Edit3 size={18} />
                                            </Link>
                                        </div>
                                        <div className="p-10 flex-1 flex flex-col justify-between">
                                            <div className="flex items-start gap-6">
                                                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                                    <MapPin size={28} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-gray-900 font-black uppercase tracking-tight text-sm">Primary Home</p>
                                                        <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Default</span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm font-bold leading-relaxed">
                                                        4528 Sunset Blvd, <br />
                                                        Los Angeles, CA 90027<br />
                                                        United States
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to="/addresses"
                                                className="w-full mt-10 py-5 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-[20px] text-gray-500 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 group transition-all cursor-pointer"
                                            >
                                                Manage Locations
                                                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                                            </Link>
                                        </div>
                                    </section>
                                </div>

                                {/* Recent Orders */}
                                <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden hover:shadow-2xl transition-all duration-500">
                                    <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/30">
                                        <h4 className="text-gray-900 font-black uppercase tracking-widest text-xs">Recent Logistics</h4>
                                        <button onClick={() => setActiveTab('orders')} className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer">View full history</button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                                            <div
                                                key={order?.id || Math.random()}
                                                onClick={() => order?.id && navigate(`/order-tracking/${order.id}`)}
                                                className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-8">
                                                    <div className="size-16 bg-gray-100 rounded-[20px] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105 transition-all duration-500 border border-transparent group-hover:border-primary/20">
                                                        <Package size={28} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-900 font-black text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">Manifest #{order?.id || 'N/A'}</p>
                                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{order?.date || 'Today'} • {order?.items?.length || 0} Units</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-12">
                                                    <div className="text-right hidden sm:block">
                                                        <p className="text-gray-900 font-black text-xl tracking-tighter mb-1">₹{Number(order?.total || 0).toFixed(0)}</p>
                                                        <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order?.status === 'Delivered' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {order?.status || 'Pending'}
                                                        </span>
                                                    </div>
                                                    <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1 duration-500">
                                                        <ChevronRight size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-20 text-center">
                                                <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-gray-50/50">
                                                    <Package size={32} className="text-gray-300" />
                                                </div>
                                                <h3 className="font-black text-gray-900 text-xl tracking-tight mb-2">Manifest list is empty</h3>
                                                <p className="text-gray-400 font-medium mb-10 max-w-xs mx-auto">Your supply chain history will appear here once you place orders.</p>
                                                <Link to="/" className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                                                    Start Sourcing <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </>
                        )}


                        {activeTab === 'orders' && (
                            <section className="bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                                <div className="p-10 border-b border-gray-50 bg-gray-50/20">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Order Logistics</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Full historical record of your deliveries</p>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {safeOrders.length > 0 ? safeOrders.map(order => (
                                        <div
                                            key={order?.id || Math.random()}
                                            onClick={() => order?.id && navigate(`/order-tracking/${order.id}`)}
                                            className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className="size-16 bg-gray-100 rounded-[20px] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105 transition-all duration-500">
                                                    <Package size={28} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-black text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">Manifest #{order?.id || 'N/A'}</p>
                                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{order?.date || 'Today'} • {order?.items?.length || 0} Units</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-gray-900 font-black text-xl tracking-tighter mb-1">₹{Number(order?.total || 0).toFixed(0)}</p>
                                                    <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order?.status === 'Delivered' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {order?.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1 duration-500">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No logistics records found.</div>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeTab === 'payments' && (
                            <section className="bg-white p-10 md:p-14 rounded-[48px] border border-gray-100 shadow-premium animate-in fade-in zoom-in-95 duration-500">
                                <div className="space-y-2 mb-12">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Secured Channels</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage your high-speed payment methods</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-10 rounded-[32px] bg-gray-900 text-white flex flex-col justify-between h-64 relative overflow-hidden group shadow-2xl shadow-gray-900/10 border border-gray-800">
                                        <div className="absolute top-0 right-0 p-40 bg-primary/10 rounded-full translate-x-12 -translate-y-12 blur-[100px] group-hover:bg-primary/20 transition-colors duration-1000" />
                                        <div className="flex justify-between items-start z-10">
                                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                                <CreditCard size={32} className="text-primary" />
                                            </div>
                                            <span className="font-black uppercase tracking-widest text-[8px] bg-primary text-white px-3 py-1.5 rounded-lg shadow-lg shadow-primary/20">Primary Asset</span>
                                        </div>
                                        <div className="z-10 space-y-6">
                                            <p className="font-mono text-3xl font-black tracking-[0.2em] leading-none">•••• 4242</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2">Valid Thru</p>
                                                    <p className="text-sm font-black tracking-widest">12 / 28</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="size-10 rounded-full bg-gray-900/80 backdrop-blur-sm shadow-lg" />
                                                    <div className="size-10 rounded-full bg-primary/80 backdrop-blur-sm -ml-4 shadow-lg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="h-64 rounded-[32px] border-4 border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer">
                                        <div className="size-16 rounded-3xl bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 shadow-premium">
                                            <Plus size={32} />
                                        </div>
                                        <span className="font-black uppercase tracking-widest text-[10px]">Terminal Gateway</span>
                                    </button>
                                </div>
                            </section>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;
