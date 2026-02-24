import React from 'react';
import { X, Trash2, Plus, Minus, Lock, ShoppingCart } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const CartDrawer = () => {
    const { t, language } = useLanguage();
    const { cart: cartItems, isCartOpen: isOpen, closeCart: onClose, updateQuantity: onUpdateQuantity, removeFromCart: onRemoveItem, cartTotal } = useCart();
    const { isAuthenticated } = useUser();
    const navigate = useNavigate();

    const subtotal = cartTotal;
    const totalOriginalPrice = cartItems.reduce((acc, item) => acc + ((item.oldPrice || item.price) * item.quantity), 0);
    const totalSavings = totalOriginalPrice - subtotal;
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        onClose();
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-[9999] shadow-2xl flex flex-col border-l border-white/50"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                                {t('cart', 'title')} <span className="text-lg font-bold text-gray-400">({totalItems})</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900 cursor-pointer"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 flex flex-col gap-6 custom-scrollbar bg-gray-50/50">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-5 group bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-28 w-28 flex-shrink-0 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative">
                                            <ImageWithFallback
                                                src={item.images ? item.images[0].url : item.img}
                                                alt={item.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 pr-2">
                                                    <h3 className="font-bold text-gray-900 leading-snug text-sm group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                                        {language === 'hi' && item.name_hi ? item.name_hi : item.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black bg-gray-50 px-2 py-0.5 rounded-md">{item.brand}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onRemoveItem(item.id)}
                                                    className="text-gray-300 hover:text-primary transition-colors cursor-pointer p-1.5 hover:bg-secondary rounded-full -mr-2 -mt-2"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-xl h-9 bg-gray-50 p-1">
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, parseInt(item.quantity) - 1)}
                                                        className="w-7 h-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black text-gray-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(item.id, parseInt(item.quantity) + 1)}
                                                        className="w-7 h-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-lg text-gray-900 tracking-tight">{t('common', 'currency')}{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}</p>
                                                    {(item?.quantity || 0) > 1 && <p className="text-[10px] text-gray-400 font-bold">{t('common', 'currency')}{(item?.price || 0).toFixed(2)} / {t('common', 'perUnit')}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-60">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingCart size={40} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{t('cart', 'empty')}</h3>
                                    <p className="text-sm text-gray-500 max-w-[200px] mx-auto leading-relaxed">{t('cart', 'emptyText')}</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-8 text-primary font-black hover:underline cursor-pointer uppercase tracking-widest text-xs"
                                    >
                                        {t('cart', 'startShopping')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart Summary Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 md:p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20 space-y-5">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold">{t('cart', 'subtotal')}</span>
                                        <span className="font-black text-gray-900 tracking-tight">{t('common', 'currency')}{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-bold">{t('cart', 'shipping')}</span>
                                        <span className="text-gray-400 text-xs font-medium bg-gray-50 px-2 py-1 rounded-md">{t('cart', 'calcAtCheckout')}</span>
                                    </div>
                                    {totalSavings > 0 && (
                                        <div className="flex justify-between items-center text-sm text-green-600 font-bold bg-green-50 p-3 rounded-xl">
                                            <span>{t('cart', 'savings')}</span>
                                            <span>-{t('common', 'currency')}{totalSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="pt-4 flex justify-between items-center border-t border-dashed border-gray-200 mt-2">
                                        <span className="text-lg font-black text-gray-900 uppercase tracking-tight">{t('cart', 'total')}</span>
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">{t('common', 'currency')}{subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 cursor-pointer"
                                >
                                    <Lock size={20} className="stroke-[2.5]" />
                                    {t('cart', 'checkout')}
                                </button>
                                <p className="text-[11px] text-center text-gray-400 px-4 leading-relaxed font-medium">
                                    {t('cart', 'points')}{' '}
                                    <button className="underline font-bold text-gray-900 hover:text-primary transition-colors cursor-pointer">{t('cart', 'joinNow')}</button>.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


export default CartDrawer;
