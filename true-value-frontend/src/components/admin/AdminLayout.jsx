import React from 'react';
import {
    LayoutDashboard, Package, ShoppingCart, Users,
    Settings, LogOut, ChevronRight, Menu, X, Bell, Search,
    Layers, Megaphone
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const AdminLayout = ({ children }) => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: Layers, label: 'Categories', path: '/admin/categories' },
        { icon: Megaphone, label: 'Promotions', path: '/admin/banners' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Users, label: 'Users', path: '/admin/users' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-display text-gray-900">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:fixed lg:h-screen lg:overflow-y-auto`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center justify-between mb-10 px-2">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary rounded-xl flex items-center justify-center font-black text-white italic">TV</div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">True<span className="text-primary">Value</span></span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Management Interface</p>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'}
                                className={({ isActive }) => `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
                                }
                            >
                                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                                <span className="font-bold text-sm uppercase tracking-widest">{item.label}</span>
                                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                        <button className="flex items-center gap-4 px-4 py-4 rounded-2xl w-full text-gray-400 hover:bg-white/5 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                            <Settings size={20} />
                            Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-4 py-4 rounded-2xl w-full text-red-400 hover:bg-red-400/10 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <LogOut size={20} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500">
                            <Menu size={24} />
                        </button>
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search Dashboard..."
                                className="pl-12 pr-6 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold w-80 focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <div className="h-8 w-px bg-gray-100" />
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-gray-900 leading-none">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Global Admin</p>
                            </div>
                            <div className="size-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden">
                                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} alt="Admin" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-6 md:p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
