import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Lock, CreditCard, Wallet, Truck, Plus, Trash2, ShieldCheck, Verified, ArrowLeft, Banknote, Landmark, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import showAlert from '../utils/swal';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const CheckoutPage = () => {
    const { t } = useLanguage();
    const { cart, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated, addresses, placeOrder } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Ensure addresses is available before accessing
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find(a => a.isDefault);
            setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
        }
    }, [addresses, selectedAddressId]);

    const selectedAddress = addresses?.find(a => a.id === selectedAddressId) || (addresses && addresses[0]);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [promoCode, setPromoCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const subtotal = cartTotal;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 15;
    const total = subtotal + tax + shipping - discountAmount;

    const [isProcessing, setIsProcessing] = useState(false);
    const [isOrderPlacing, setIsOrderPlacing] = useState(false); // Added state
    const [orderSuccess, setOrderSuccess] = useState(null); // Added state

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            showAlert({ title: "Address Required", text: "Please select or add a shipping address.", icon: "error" });
            return;
        }

        if (cart.length === 0) {
            showAlert({ title: t('cart', 'empty'), text: t('cart', 'emptyText'), icon: "warning" });
            return;
        }

        setIsOrderPlacing(true);
        try {
            // In a real app, you'd process payment here
            const newOrder = await placeOrder(cart, total, selectedAddress); // Changed finalTotal to total

            setIsOrderPlacing(false);
            setOrderSuccess(newOrder); // Pass the new order object
            clearCart();

            showAlert({
                title: "Order Processed!",
                text: `Your premium order #${newOrder.id || newOrder._id} has been initiated for fulfillment.`,
                icon: "success"
            }).then(() => {
                navigate('/order-confirmation'); // Kept navigation
            });
        } catch (error) {
            setIsOrderPlacing(false);
            showAlert({ title: "Order Failed", text: error.message || "Could not process your order.", icon: "error" });
        }
    };

    const applyPromo = async () => {
        if (!promoCode) return;

        try {
            const response = await fetch('http://localhost:5000/api/marketing/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: promoCode,
                    subtotal: subtotal,
                    orderItems: cart.map(item => ({
                        product: item.id,
                        vendor: item.vendorId || item.vendor // Supporting both frontend/backend formats
                    }))
                })
            });

            const data = await response.json();

            if (data.success) {
                setDiscountAmount(data.data.discountAmount);
                setAppliedCoupon(data.data.code);
                showAlert({
                    title: t('checkout', 'voucherValidated'),
                    text: `${t('common', 'currency')}${data.data.discountAmount.toLocaleString()} ${t('checkout', 'yieldBonus')}`,
                    icon: 'success'
                });
            } else {
                setDiscountAmount(0);
                setAppliedCoupon(null);
                showAlert({ title: t('checkout', 'invalidKey'), text: data.message || t('checkout', 'invalidKey'), icon: 'error' });
            }
        } catch (error) {
            console.warn('Coupon API Error:', error);
            // Fallback: Local Validation
            if (promoCode.toUpperCase() === 'SAVE10') {
                const discount = subtotal * 0.10;
                setDiscountAmount(discount);
                setAppliedCoupon('SAVE10');
                showAlert({
                    title: t('checkout', 'voucherValidated'),
                    text: `${t('common', 'currency')}${discount.toLocaleString()} ${t('checkout', 'yieldBonus')}`,
                    icon: 'success'
                });
            } else if (promoCode.toUpperCase() === 'WELCOME20') {
                const discount = subtotal * 0.20;
                setDiscountAmount(discount);
                setAppliedCoupon('WELCOME20');
                showAlert({
                    title: t('checkout', 'voucherValidated'),
                    text: `${t('common', 'currency')}${discount.toLocaleString()} ${t('checkout', 'yieldBonus')}`,
                    icon: 'success'
                });
            } else {
                showAlert({ title: t('checkout', 'invalidKey'), text: t('checkout', 'invalidKey'), icon: 'error' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-display transition-colors duration-500 selection:bg-primary/20">
            {/* Top Navigation */}
            <header className="border-b border-gray-100 bg-white px-4 md:px-10 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 cursor-pointer group">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-black leading-tight tracking-tight text-gray-900 uppercase italic">TrueValue</h2>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/products"
                            className="text-gray-500 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <ShoppingCart size={18} />
                            {t('checkout', 'returnFleet')}
                        </Link>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-md ring-2 ring-gray-100" style={{ backgroundImage: `url("${user?.avatar}")` }} />
                    </div>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-6 py-10">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-2 mb-6 ml-1">
                        <Link to="/products" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                            <CheckCircle size={14} /> {t('checkout', 'shippingTab')}
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 text-[10px] font-black uppercase tracking-widest">{t('checkout', 'paymentTab')}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest text-opacity-30">{t('checkout', 'reviewTab')}</span>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-premium animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-900 text-[10px] font-black uppercase tracking-[0.2em]">{t('checkout', 'subtitle')}</p>
                            <p className="text-primary text-xs font-black italic">{t('checkout', 'secure')}</p>
                        </div>
                        <div className="rounded-full bg-gray-100 h-2 w-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '66%' }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-primary shadow-lg shadow-primary/30"
                            />
                        </div>
                    </div>
                </div>

                {/* Page Heading */}
                <div className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-left-6 duration-1000">
                    <h1 className="text-gray-900 text-5xl lg:text-7xl font-black leading-none tracking-tighter mb-4 italic uppercase">{t('checkout', 'title')}</h1>
                    <p className="text-gray-400 text-lg font-bold max-w-2xl italic">{t('checkout', 'subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Shipping Summary */}
                        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-premium animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-5">
                                    <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                        <Truck size={28} />
                                    </div>
                                    {t('checkout', 'shippingAddress')}
                                </h3>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
                                >
                                    {t('checkout', 'modifyRoute')}
                                </button>
                            </div>
                            <div className="text-gray-500 space-y-2 font-bold text-xl leading-relaxed pl-8 border-l-4 border-primary/20">
                                <p className="font-black text-gray-900 text-2xl mb-2 italic uppercase">{user?.name}</p>
                                <p>{selectedAddress?.street}</p>
                                <p>{selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zip}</p>
                                <p className="text-primary/40 font-black uppercase text-[10px] tracking-[0.3em] pt-4">{selectedAddress?.country || 'GLOBAL LOGISTICS HUB'}</p>
                            </div>
                        </section>

                        {/* Payment Details */}
                        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-premium animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-10 flex items-center gap-5 border-b border-gray-50 pb-8">
                                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                    <CreditCard size={28} />
                                </div>
                                {t('checkout', 'paymentMethod')}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
                                {[
                                    { id: 'card', label: t('checkout', 'protocolA'), icon: CreditCard },
                                    { id: 'upi', label: t('checkout', 'hyperpay'), icon: Zap },
                                    { id: 'wallet', label: t('checkout', 'omnivault'), icon: Wallet },
                                    { id: 'netbanking', label: t('checkout', 'direct'), icon: Landmark },
                                    { id: 'cod', label: t('checkout', 'postpay'), icon: Banknote },
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`relative border-2 rounded-[24px] p-5 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all duration-500 aspect-square text-center ${paymentMethod === method.id
                                            ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-105'
                                            : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:shadow-xl'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_type"
                                            checked={paymentMethod === method.id}
                                            onChange={() => { }}
                                            className="hidden"
                                        />
                                        <method.icon size={30} className={paymentMethod === method.id ? 'text-primary' : 'text-gray-300'} />
                                        <span className={`font-black uppercase tracking-[0.15em] text-[9px] ${paymentMethod === method.id ? 'text-gray-900' : 'text-gray-400'}`}>{method.label}</span>
                                        {paymentMethod === method.id && (
                                            <motion.div
                                                layoutId="activePayment"
                                                className="absolute top-4 right-4 size-2.5 rounded-full bg-primary ring-4 ring-primary/20"
                                            />
                                        )}
                                    </label>
                                ))}
                            </div>

                            {paymentMethod === 'card' && (
                                <form className="space-y-8 max-w-2xl mx-auto bg-gray-50/50 p-8 md:p-12 rounded-[32px] border border-gray-100 shadow-inner" onSubmit={handlePlaceOrder}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">{t('checkout', 'cardName')}</label>
                                            <input
                                                className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 transition-all outline-none placeholder:text-gray-200"
                                                placeholder={user?.name.toUpperCase()}
                                                type="text"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">{t('checkout', 'cardNumber')}</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 pr-16 transition-all outline-none uppercase font-mono tracking-widest placeholder:text-gray-200"
                                                    placeholder="0000 0000 0000 0000"
                                                    type="text"
                                                    required
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/30">
                                                    <CreditCard size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">{t('checkout', 'expiry')}</label>
                                                <input
                                                    className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 transition-all outline-none text-center placeholder:text-gray-200"
                                                    placeholder="MM/YY"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">{t('checkout', 'cvv')}</label>
                                                <input
                                                    className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 transition-all outline-none text-center placeholder:text-gray-200"
                                                    placeholder="123"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="space-y-8 max-w-xl mx-auto bg-gray-50/50 p-10 rounded-[32px] border border-gray-100 shadow-inner">
                                    <div className="space-y-2">
                                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">Hyper ID</label>
                                        <div className="relative">
                                            <input
                                                className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 pr-16 transition-all outline-none placeholder:text-gray-200"
                                                placeholder="username@bank"
                                                type="text"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary/30">
                                                <Zap size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {['@oky', '@sbi', '@hdfc', '@axis'].map(suffix => (
                                            <button key={suffix} className="px-5 py-3 rounded-xl bg-white border-2 border-gray-100 text-[10px] font-black text-gray-400 hover:text-primary hover:border-primary hover:shadow-xl transition-all active:scale-95 uppercase tracking-widest">{suffix}</button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'wallet' && (
                                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    {['PhonePe', 'GPay', 'Paytm', 'Amazon Pay'].map(wallet => (
                                        <button key={wallet} className="p-8 rounded-[28px] border-2 border-gray-100 bg-white flex items-center justify-center gap-4 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all group active:scale-[0.98] shadow-sm">
                                            <Wallet size={28} className="text-gray-300 group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-black text-gray-900 uppercase italic tracking-tighter">{wallet}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {paymentMethod === 'netbanking' && (
                                <div className="max-w-xl mx-auto bg-gray-50/50 p-10 rounded-[32px] border border-gray-100 shadow-inner">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 pl-1">Financial Node</label>
                                    <div className="relative">
                                        <select className="w-full rounded-2xl border-2 border-gray-100 bg-white py-5 px-6 text-sm font-black text-gray-900 focus:ring-0 focus:border-primary focus:shadow-2xl focus:shadow-primary/5 outline-none appearance-none cursor-pointer uppercase tracking-widest">
                                            <option>HDFC Terminal</option>
                                            <option>ICICI Terminal</option>
                                            <option>SBI Node</option>
                                            <option>Axis Gateway</option>
                                            <option>Kotak Secure</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                            <ArrowLeft size={18} className="-rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'cod' && (
                                <div className="py-16 text-center space-y-6 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 max-w-xl mx-auto shadow-inner">
                                    <div className="size-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 text-primary">
                                        <Banknote size={40} strokeWidth={1} />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-900 font-black text-2xl uppercase italic tracking-tighter">Terminal Settlement</p>
                                        <p className="text-gray-400 font-bold text-sm italic">Direct procurement upon physical logistics arrival.</p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Review Items */}
                        <section className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-premium animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex items-center justify-between mb-10 border-b border-gray-50 pb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-5">
                                    <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                        <ShoppingCart size={28} />
                                    </div>
                                    {t('checkout', 'itemsInManifest')} ({cart.length})
                                </h3>
                                <Link to="/products" className="text-[9px] font-black uppercase tracking-[0.3em] text-primary hover:underline">Edit Selection</Link>
                            </div>
                            <div className="space-y-8">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-8 items-center p-6 rounded-[32px] bg-white border border-gray-50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
                                        <div className="size-28 bg-gray-50 rounded-2xl border border-gray-50 overflow-hidden flex-shrink-0 relative shadow-inner">
                                            <img src={item.images ? item.images[0].url : item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <h4 className="font-black text-gray-900 text-xl tracking-tighter leading-none italic uppercase group-hover:text-primary transition-colors">{item.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">SKU: {item.sku || 'TV-UNIT'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-primary/5 text-primary px-3 py-1.5 rounded-lg border border-primary/10">Units: {item.quantity}</span>
                                            <p className="font-black text-gray-900 text-3xl tracking-tighter">{t('common', 'currency')}{((item?.price || 0) * (item?.quantity || 0)).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000">
                            <div className="bg-gray-900 rounded-[48px] p-10 text-white shadow-3xl shadow-gray-900/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-1000" />

                                <h3 className="text-2xl font-black tracking-tighter italic uppercase text-white mb-10 border-b border-white/5 pb-6 relative z-10 flex items-center justify-between">
                                    {t('cart', 'orderSummary') || 'Summary'}
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Order V42</span>
                                </h3>

                                <div className="space-y-5 mb-10 relative z-10">
                                    <div className="flex justify-between text-gray-400 font-bold text-sm italic">
                                        <span className="uppercase tracking-widest text-[10px]">{t('checkout', 'assetBase')}</span>
                                        <span className="text-white text-lg font-black tracking-tighter">{t('common', 'currency')}{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-sm italic">
                                        <span className="uppercase tracking-widest text-[10px]">{t('checkout', 'logistics')}</span>
                                        <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px] bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">{t('checkout', 'free')}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold text-sm italic">
                                        <span className="uppercase tracking-widest text-[10px]">{t('checkout', 'taxes')}</span>
                                        <span className="text-white text-lg font-black tracking-tighter">{t('common', 'currency')}{tax.toLocaleString()}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex justify-between text-primary font-black text-sm bg-primary/10 p-4 rounded-2xl border border-primary/20 italic"
                                        >
                                            <span className="flex items-center gap-2 uppercase tracking-[0.2em] text-[9px]"><Zap size={14} className="fill-current" /> {t('checkout', 'yieldBonus')} ({appliedCoupon})</span>
                                            <span className="text-lg tracking-tighter">-{t('common', 'currency')}{discountAmount.toLocaleString()}</span>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-dashed border-white/10 mb-10 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">{t('checkout', 'totalManifest')}</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-primary text-xl font-black italic -mb-2">{t('common', 'currency')}</span>
                                            <span className="text-6xl font-black tracking-tighter text-white">{total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-10 relative z-10">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 ml-1">{t('checkout', 'voucherKey')}</label>
                                    <div className="flex gap-3">
                                        <input
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-1 rounded-2xl border border-white/5 bg-white/5 text-[10px] font-black text-white focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all px-5 uppercase placeholder:text-gray-600 tracking-widest"
                                            placeholder="TRY: SAVE10"
                                            type="text"
                                        />
                                        <button
                                            onClick={applyPromo}
                                            className="bg-white text-gray-900 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white active:scale-95 transition-all shadow-xl shadow-black/20"
                                        >
                                            {t('checkout', 'apply')}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing}
                                    className="w-full bg-primary text-white hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-3xl shadow-primary/30 relative z-10 group/btn"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('checkout', 'processing')}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Lock size={18} className="stroke-[3] group-hover/btn:rotate-12 transition-transform" />
                                            {t('checkout', 'placeOrder')}
                                        </>
                                    )}
                                </button>

                                <p className="text-[9px] text-center text-gray-600 mt-8 leading-relaxed font-bold uppercase tracking-widest px-6 opacity-50 relative z-10">
                                    {t('auth', 'authNote')}
                                </p>
                            </div>

                            {/* Security Badges */}
                            <div className="flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-100 transition-all duration-1000 pt-6">
                                <div className="flex flex-col items-center gap-3 group px-4">
                                    <Verified size={32} className="text-gray-400 group-hover:text-primary transition-colors stroke-1" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Validated</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 group px-4">
                                    <ShieldCheck size={32} className="text-gray-400 group-hover:text-primary transition-colors stroke-1" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Encrypted</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 group px-4 border-l border-gray-100">
                                    <Truck size={32} className="text-gray-400 group-hover:text-primary transition-colors stroke-1" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Insured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Help */}
                <footer className="mt-32 pt-16 border-t border-gray-50 text-center pb-20 animate-in fade-in duration-1000 delay-500">
                    <p className="text-gray-400 text-sm font-bold italic">
                        {t('checkout', 'assistance')} <button className="text-primary font-black hover:underline px-2">{t('checkout', 'contactOps')}</button> or call <span className="text-gray-900">1-800-TRUE-VAL</span>
                    </p>
                </footer>
            </main>

            {/* Address Selection Modal */}
            <AnimatePresence>
                {isAddressModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddressModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white w-full max-w-xl rounded-[48px] p-10 md:p-12 border border-white/50 shadow-4xl relative z-10"
                        >
                            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic mb-10 text-center">Modify Route Node</h3>
                            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar lg:max-h-none">
                                {addresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => {
                                            setSelectedAddressId(addr.id);
                                            setIsAddressModalOpen(false);
                                        }}
                                        className={`w-full text-left p-6 rounded-[32px] border-2 transition-all group duration-500 relative ${selectedAddressId === addr.id
                                            ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10'
                                            : 'border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200 hover:shadow-xl'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-4">
                                                <p className="font-black text-[9px] uppercase tracking-[0.4em] text-gray-400 group-hover:text-primary transition-colors">{addr.type} Node</p>
                                                <div className="space-y-1">
                                                    <p className="text-xl font-black text-gray-900 leading-none uppercase italic tracking-tighter">{addr.street}</p>
                                                    <p className="text-sm text-gray-400 font-bold italic">{addr.city}, {addr.state} {addr.zip}</p>
                                                </div>
                                            </div>
                                            {selectedAddressId === addr.id && (
                                                <motion.div
                                                    layoutId="modalSelected"
                                                    className="bg-primary text-white p-2 rounded-2xl shadow-xl shadow-primary/30"
                                                >
                                                    <CheckCircle size={20} className="stroke-[3]" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-12 flex gap-4">
                                <Link
                                    to="/addresses"
                                    className="flex-[0.6] py-5 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-gray-900 hover:text-white transition-all border border-gray-100 flex items-center justify-center"
                                >
                                    {t('checkout', 'fleetMap')}
                                </Link>
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="flex-1 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all"
                                >
                                    {t('checkout', 'authorize')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CheckoutPage;
