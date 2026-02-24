import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, HelpCircle, Search, Clock, CalendarX, MessageCircle, ChevronLeft } from 'lucide-react';
import showAlert from '../utils/swal';
import { Link, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/home/HomeNavbar';

const OrderTrackingSearchPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        orderNumber: '',
        email: ''
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.orderNumber || !formData.email) {
            showAlert({
                title: 'Missing Logistics Data',
                text: 'Order Number and Billing Email are required to initiate tracking.',
                icon: 'warning'
            });
            return;
        }

        // Validate order number format (TV-XXXXX)
        if (!formData.orderNumber.match(/^TV-\d{5}$/i)) {
            showAlert({
                title: 'Invalid ID Format',
                text: 'Logistics ID must follow the standard format (e.g., TV-12345)',
                icon: 'error'
            });
            return;
        }

        // Navigate to tracking page with the order ID
        navigate(`/order-tracking/${formData.orderNumber.toUpperCase()}`);
    };

    const faqItems = [
        {
            icon: Search,
            title: "Missing Transaction ID?",
            description: "Check your verified inbox for 'TrueValue Order Confirmation'. Your tracking ID starts with 'TV-'."
        },
        {
            icon: Clock,
            title: "Data Sync Delays",
            description: "Fleet tracking typically synchronizes within 12-24 hours post-dispatch from our central hub."
        },
        {
            icon: CalendarX,
            title: "Partial Fulfillment?",
            description: "High-volume orders may be split across multiple delivery nodes. Check your digital manifest for details."
        },
        {
            icon: MessageCircle,
            title: "Logistics Support",
            description: "Our dispatcher squad is active 24/7 for premium tier users. Standard support is Mon-Fri.",
            link: true
        }
    ];

    return (
        <div className="min-h-screen bg-white font-display text-gray-900 selection:bg-primary/20 flex flex-col">
            <HomeNavbar />

            <main className="flex-grow flex flex-col items-center py-16 px-4 md:px-8">
                {/* Hero Section */}
                <div className="max-w-[800px] w-full text-center mb-16 animate-in fade-in slide-in-from-top-6 duration-700">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-[0.3em] mb-6 border border-primary/10">
                        <Truck size={14} />
                        Fleet Intelligence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic uppercase leading-none">Track Your <span className="text-primary">Manifest</span></h1>
                    <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
                        Access real-time telemetry and order status without authenticated session.
                    </p>
                </div>

                {/* Search Card */}
                <div className="max-w-[560px] w-full bg-white p-10 md:p-14 rounded-[48px] shadow-3xl border border-gray-50 relative overflow-hidden animate-in zoom-in-95 duration-1000">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div className="space-y-4">
                            <label className="flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                Logistics ID
                                <HelpCircle size={14} className="text-gray-300" />
                            </label>
                            <input
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleInputChange}
                                className="w-full h-18 bg-gray-50/50 border border-gray-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-xl font-black tracking-tight text-gray-900 placeholder-gray-300"
                                placeholder="e.g. TV-98231"
                                type="text"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                                Verified Billing Email
                            </label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full h-18 bg-gray-50/50 border border-gray-100 rounded-2xl px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-lg font-bold text-gray-900 placeholder-gray-300"
                                placeholder="ident@example.com"
                                type="email"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white h-20 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 cursor-pointer shadow-xl shadow-gray-200"
                        >
                            <Search size={20} className="stroke-[3]" />
                            Initialize Tracking
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-gray-50 text-center relative z-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                            Logistics manifests are typically processed within 24 hours.<br />
                            <Link to="/profile" className="text-primary hover:underline ml-1">View authenticated history</Link>
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-[1000px] w-full mt-32">
                    <div className="flex items-center gap-6 mb-12 animate-in fade-in duration-1000">
                        <div className="h-px flex-grow bg-gray-100"></div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300">Operations Protocol</h2>
                        <div className="h-px flex-grow bg-gray-100"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-premium hover:shadow-2xl transition-all group animate-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start gap-6">
                                    <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-sm">
                                        <item.icon size={26} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-900 text-lg tracking-tight mb-2 group-hover:text-primary transition-colors uppercase italic">{item.title}</h3>
                                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                            {item.description}
                                            {item.link && (
                                                <button onClick={() => showAlert({ title: 'Squad Support', text: 'Connecting...', icon: 'info' })} className="text-primary font-black hover:underline ml-1 uppercase text-[10px] tracking-widest">
                                                    Dispatch Squad
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="w-full bg-white py-12 px-8 border-t border-gray-100 mt-20">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3 opacity-40">
                        <Link to="/" className="text-lg font-black tracking-tighter grayscale">TrueValue</Link>
                        <span className="text-[10px] font-black uppercase tracking-widest">© 2026 Fleet Intelligence</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link className="hover:text-primary transition-colors" to="/privacy-policy">Privacy Protocol</Link>
                        <Link className="hover:text-primary transition-colors" to="/terms-of-use">Terms of Operations</Link>
                        <button className="hover:text-primary transition-colors uppercase" onClick={() => showAlert({ title: 'Support', text: 'Help is on the way.', icon: 'info' })}>Emergency Dispatch</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OrderTrackingSearchPage;
