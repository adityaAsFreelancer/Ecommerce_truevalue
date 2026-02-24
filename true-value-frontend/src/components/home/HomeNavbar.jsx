import React, { useState, useEffect } from 'react';
import {
    Search, ShoppingCart, User, Menu,
    X, Heart, MapPin, Hammer, Wrench,
    PaintBucket, Package, Zap, Droplet,
    Home, Tv, Leaf, Shirt, Apple, Stethoscope, Sparkles, Bell, CheckCircle2, Drumstick, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import { useProducts } from '../../context/ProductsContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const HomeNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language, toggleLanguage, t } = useLanguage();
    const { openCart, cart } = useCart();
    const { user } = useUser();
    const { handleSearch, handleCategoryFilter } = useProducts();

    // Derived cart count
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Order Shipped", text: "Your order #TV-92841 is on the way!", time: "2 min ago", read: false, type: 'order' },
        { id: 2, title: "Flash Sale", text: "Don't miss out on 50% off power tools.", time: "1 hr ago", read: false, type: 'promo' },
        { id: 3, title: "Welcome", text: "Thanks for joining TrueValue Rewards!", time: "1 day ago", read: true, type: 'info' }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const hasAnimated = sessionStorage.getItem('tv_navbar_animated');
        if (!hasAnimated) {
            setShouldAnimate(true);
            sessionStorage.setItem('tv_navbar_animated', 'true');
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Access products from context for fallback
    const { products: localProducts } = useProducts();

    // Autocomplete Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            let apiSuccess = false;

            try {
                // Try API first with short timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 800);

                const response = await fetch(`http://localhost:5000/api/search/autocomplete?q=${searchQuery}`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setSuggestions(data.hits);
                        apiSuccess = true;
                    }
                }
            } catch (apiError) {
                // Ignore API error and proceed to fallback
            }

            // Fallback to local data if API failed
            if (!apiSuccess && localProducts) {
                const lowerQuery = searchQuery.toLowerCase();
                const localMatches = localProducts.filter(p =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.category.toLowerCase().includes(lowerQuery)
                ).slice(0, 5).map(p => ({
                    objectID: p.id,
                    name: p.name,
                    price: p.price,
                    images: p.images ? [p.images[0].url] : [p.img],
                    category: p.category
                }));
                setSuggestions(localMatches);
            }

            setIsLoading(false);
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, localProducts]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchQuery);
        navigate('/products');
    };

    const handleCategoryClick = (query) => {
        handleCategoryFilter(query);
        navigate('/products');
        setIsMobileMenuOpen(false);
    };

    const handleNotificationClick = (notification) => {
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));

        if (notification.type === 'order') {
            navigate('/tracking-search');
            setIsNotificationsOpen(false);
        } else if (notification.type === 'promo') {
            navigate('/deals');
            setIsNotificationsOpen(false);
        }
    };

    const categories = [
        { name: "Vegetables", name_hi: "सब्जियां", icon: <Leaf size={16} />, query: "Vegetables", color: "text-green-600 bg-green-50" },
        { name: "Fruits", name_hi: "फल", icon: <Apple size={16} />, query: "Fruits", color: "text-red-500 bg-red-50" },
        { name: "Meat", name_hi: "मांस", icon: <Drumstick size={16} />, query: "Meat & Poultry", color: "text-rose-600 bg-rose-50" },
        { name: "Dairy", name_hi: "डेयरी", icon: <Droplet size={16} />, query: "Dairy", color: "text-blue-500 bg-blue-50" },
        { name: "Grocery", name_hi: "किराना", icon: <Package size={16} />, query: "Cooking Essentials", color: "text-orange-500 bg-orange-50" },
        { name: "Frozen", name_hi: "फ्रोजन", icon: <Zap size={16} />, query: "Frozen Foods", color: "text-sky-500 bg-sky-50" },
        { name: "Bakery", name_hi: "बेकरी", icon: <Sparkles size={16} />, query: "Bakery", color: "text-amber-600 bg-amber-50" },
        { name: "Women's Care", name_hi: "महिला देखभाल", icon: <Heart size={16} />, query: "Women's Care", color: "text-pink-500 bg-pink-50" },
        { name: "Baby", name_hi: "बेबी", icon: <Home size={16} />, query: "Baby Products", color: "text-purple-500 bg-purple-50" },
        { name: "Electronics", name_hi: "इलेक्ट्रॉनिक्स", icon: <Tv size={16} />, query: "Electronics", color: "text-indigo-500 bg-indigo-50" },
        { name: "Clothing", name_hi: "कपड़े", icon: <Shirt size={16} />, query: "Clothing", color: "text-violet-500 bg-violet-50" },
        { name: "Pharmacy", name_hi: "फार्मेसी", icon: <Stethoscope size={16} />, query: "Pharmacy", color: "text-teal-600 bg-teal-50" },
    ];

    return (
        <div className="flex flex-col w-full font-display">
            {/* Main Header */}
            <motion.header
                initial={shouldAnimate ? { y: -100 } : { y: 0 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'py-3 shadow-premium' : 'py-5'}`}
            >
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 lg:gap-12 px-4 md:px-8 relative">
                    <div className="flex items-center gap-4 lg:gap-12 flex-1">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 text-primary cursor-pointer transition-all active:scale-95 group"
                        >
                            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Package size={24} className="transition-transform group-hover:scale-110" />
                            </div>
                            <h1 className="text-gray-900 text-2xl font-black leading-tight tracking-tight">TrueValue</h1>
                        </Link>

                        {/* Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-2xl relative">
                            <form onSubmit={handleSearchSubmit} className="relative w-full group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    className="w-full bg-gray-50 border border-transparent focus:border-primary/20 hover:bg-white hover:border-gray-200 focus:bg-white text-gray-900 text-sm font-bold rounded-2xl pl-12 pr-4 py-3 outline-none transition-all duration-300 shadow-sm focus:shadow-lg focus:shadow-primary/5 placeholder:text-gray-400"
                                    placeholder={language === 'hi' ? 'सामान का नाम लिखें...' : 'Search for products...'}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </form>

                            {/* DROPDOWN */}
                            <AnimatePresence>
                                {showSuggestions && (searchQuery.length >= 2 || suggestions.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden z-[60]"
                                    >
                                        {isLoading ? (
                                            <div className="px-6 py-8 text-center text-gray-400 flex flex-col items-center gap-3">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-xs font-bold uppercase tracking-widest">{t('nav', 'searching') || 'Searching TrueValue...'}</span>
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            <div className="py-2">
                                                <div className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 bg-gray-50/50">
                                                    <TrendingUp size={12} /> {t('nav', 'suggestions')}
                                                </div>
                                                {suggestions.map((product) => (
                                                    <button
                                                        key={product.objectID}
                                                        onClick={() => {
                                                            setSearchQuery(product.name);
                                                            setShowSuggestions(false);
                                                            navigate(`/products/${product.objectID}`);
                                                        }}
                                                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-primary/5 transition-colors text-left group/item"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 p-2">
                                                            <img src={product.images?.[0]} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="text-sm font-black text-gray-900 group-hover/item:text-primary transition-colors">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-xs font-bold text-[#5EC401]">₹{product.price}</div>
                                                        </div>
                                                        <TrendingUp size={16} className="text-gray-100 group-hover/item:text-primary/30 transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            searchQuery.length >= 2 && (
                                                <div className="p-8 text-center text-gray-400">
                                                    <p className="text-xs font-black uppercase tracking-widest mb-1 italic">{t('nav', 'noMatches')}</p>
                                                    <p className="text-[10px] font-bold opacity-60">{t('nav', 'tryGeneric')}</p>
                                                </div>
                                            )
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="hidden lg:flex items-center bg-gray-100 p-1.5 rounded-2xl border-2 border-primary/20 shadow-sm">
                            <button
                                onClick={() => language !== 'en' && toggleLanguage()}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${language === 'en' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-gray-500 hover:text-gray-900'} `}
                            >
                                ENGLISH
                            </button>
                            <button
                                onClick={() => language !== 'hi' && toggleLanguage()}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${language === 'hi' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : 'text-gray-500 hover:text-gray-900'} `}
                            >
                                हिन्दी
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to="/wishlist"
                                className="hidden md:flex items-center justify-center size-11 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 text-gray-600 hover:text-primary transition-all duration-300"
                                title="Wishlist"
                            >
                                <Heart size={20} />
                            </Link>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className={`flex items - center justify - center size - 11 rounded - 2xl transition - all duration - 300 ${isNotificationsOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 text-gray-600'} `}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className={`absolute top-2.5 right-2.5 size-2.5 rounded-full border-2 border-white ${isNotificationsOpen ? 'bg-white' : 'bg-primary animate-pulse'}`} />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden origin-top-right z-[60]"
                                        >
                                            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                                <h3 className="font-black text-gray-900 tracking-tight">{t('nav', 'notifications')}</h3>
                                                <button onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))} className="text-xs text-primary font-black uppercase tracking-widest hover:underline cursor-pointer">{t('nav', 'markRead')}</button>
                                            </div>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(n => (
                                                        <div
                                                            key={n.id}
                                                            onClick={() => handleNotificationClick(n)}
                                                            className={`p - 5 border - b border - gray - 50 cursor - pointer hover: bg - gray - 50 transition - colors flex gap - 4 ${!n.read ? 'bg-primary/5' : ''} `}
                                                        >
                                                            <div className={`size - 2.5 mt - 2 rounded - full flex - shrink - 0 ${!n.read ? 'bg-primary shadow-lg shadow-primary/50' : 'bg-gray-200'} `} />
                                                            <div>
                                                                <h4 className="font-black text-sm text-gray-900 mb-1">{n.title}</h4>
                                                                <p className="text-sm text-gray-500 leading-relaxed font-medium">{n.text}</p>
                                                                <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-wider">{n.time}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-12 text-center text-gray-400 text-sm font-medium">{t('nav', 'noNotifications')}</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={openCart}
                                className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-wide"
                            >
                                <ShoppingCart size={20} />
                                <span className="hidden sm:inline">{t('nav', 'myCart')}</span>
                                {cartCount > 0 && (
                                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <Link
                                to="/profile"
                                className="hidden md:flex size-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-transparent hover:border-primary/20 bg-gray-50 hover:bg-white transition-all active:scale-95 shadow-sm"
                            >
                                {user ? (
                                    <img
                                        src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={20} className="text-gray-900" />
                                )}
                            </Link>

                            <button
                                className="lg:hidden size-11 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-900 hover:bg-white hover:shadow-md transition-all"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="lg:hidden bg-white border-t border-gray-50 px-4 py-4 relative">
                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={language === 'hi' ? 'यहाँ सामान ढूँढें...' : 'Search here...'}
                            className="w-full bg-gray-50 border-none text-gray-900 text-sm font-bold rounded-xl pl-12 py-3 outline-none focus:bg-white focus:shadow-md transition-all"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                        />
                    </form>
                </div>

                {/* Category Sub-Nav */}
                <nav className="bg-white/80 backdrop-blur-md border-t border-gray-100 overflow-x-auto scrollbar-hide">
                    <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-4 md:px-8 py-4 whitespace-nowrap">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleCategoryClick(cat.query)}
                                className="text-xs font-black text-gray-500 hover:text-gray-900 flex items-center gap-2.5 transition-all group uppercase tracking-widest"
                            >
                                <span className={`transition-colors p-2 rounded-lg ${cat.color}`}>
                                    {React.cloneElement(cat.icon, { size: 16 })}
                                </span>
                                {language === 'hi' ? (cat.name_hi || cat.name) : cat.name}
                            </button>
                        ))}
                    </div>
                </nav>
            </motion.header>

            {/* Spacer */}
            <div className="h-[155px] lg:h-[165px] w-full" />

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden fixed top-[155px] left-0 right-0 z-40 shadow-premium"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="font-black text-gray-900 uppercase tracking-wide">Language</span>
                                <div className="flex gap-2">
                                    <Link
                                        to="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center p-2 rounded-xl bg-gray-50 text-gray-900"
                                    >
                                        <Home size={20} />
                                    </Link>
                                    <button
                                        onClick={toggleLanguage}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 text-gray-900"
                                    >
                                        <span className={language === 'en' ? 'text-primary' : 'text-gray-400'}>EN</span>
                                        <span className="text-gray-300">/</span>
                                        <span className={language === 'hi' ? 'text-primary' : 'text-gray-400'}>HI</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleCategoryClick(cat.query)}
                                        className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-primary/5 border border-transparent hover:border-primary/10"
                                    >
                                        <div className="text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">{cat.icon}</div>
                                        <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">{language === 'hi' ? (cat.name_hi || cat.name) : cat.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex gap-4">
                                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-black flex items-center justify-center gap-2 text-gray-900 uppercase tracking-wide">
                                    <User size={18} /> {t('nav', 'account')}
                                </Link>
                                <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-black flex items-center justify-center text-gray-900 uppercase tracking-wide">Deals</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeNavbar;
