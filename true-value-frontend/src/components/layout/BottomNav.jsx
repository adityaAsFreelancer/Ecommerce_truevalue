import React from 'react';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const BottomNav = () => {
    const location = useLocation();
    const { t, language } = useLanguage();
    const { cart, openCart } = useCart();
    const { unreadCount } = useUser();

    // Derived cart count
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const navItems = [
        { path: '/', icon: Home, label: t('nav', 'home'), hi: 'होम' },
        { path: '/products', icon: Search, label: t('nav', 'search_title') || 'Search', hi: 'खोजें' },
        { path: '/cart-action', isCart: true, icon: ShoppingCart, label: t('nav', 'cart'), hi: 'झोला' },
        { path: '/profile', icon: User, label: t('nav', 'account'), hi: 'खाता' }
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-2 py-3 z-[100] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-8">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                if (item.isCart) {
                    return (
                        <button
                            key="bottom-cart"
                            onClick={openCart}
                            className="flex flex-col items-center justify-center gap-1.5 min-w-[64px] relative"
                        >
                            <div className="size-12 bg-primary flex items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20 scale-110 -translate-y-2 border-4 border-white">
                                <item.icon size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white px-1.5 py-0.5 rounded-full border-2 border-white font-black">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                                {language === 'hi' ? item.hi : item.label}
                            </span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center gap-1.5 min-w-[64px] transition-all relative ${isActive ? 'text-primary scale-110' : 'text-gray-400'}`}
                    >
                        <div className="relative">
                            <item.icon size={22} className={isActive ? 'stroke-[2.5px]' : ''} />
                            {item.path === '/profile' && unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary opacity-100' : 'text-gray-400 opacity-60'}`}>
                            {language === 'hi' ? item.hi : item.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
