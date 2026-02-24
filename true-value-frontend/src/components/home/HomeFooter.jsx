import { Hammer, Facebook, Twitter, Instagram, Youtube, Globe, Share2, Send, Package } from 'lucide-react';
import showAlert from '../../utils/swal';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const HomeFooter = ({ footerContent }) => {
    const { t } = useLanguage();

    if (!footerContent) return null;

    const navLinks = {
        customerService: [
            { label: t('footer', 'links')?.contact || 'Contact Us', to: '/contact' },
            { label: t('footer', 'links')?.track || 'Track Order', to: '/tracking-search' },
            { label: t('footer', 'links')?.shipping || 'Shipping Policy', to: '/shipping-policy' },
            { label: t('footer', 'links')?.faq || 'FAQ', to: '/faq' },
            { label: t('footer', 'links')?.help || 'Help Center', to: '/help-center' },
        ],
        resources: [
            { label: t('footer', 'links')?.tips || 'Tips & Advice', to: '/tips' },
            { label: t('footer', 'links')?.stores || 'Store Locator', to: '/stores' },
            { label: t('footer', 'links')?.deals || 'Weekly Deals', to: '/deals' },
            { label: t('footer', 'links')?.rewards || 'Rewards Program', to: '/rewards' },
            { label: t('footer', 'links')?.calculator || 'Project Calculator', to: '/calculator' },
        ],
        shop: [
            { label: t('footer', 'links')?.allProducts || 'All Products', to: '/products' },
            { label: t('footer', 'links')?.homePage || 'Home Page', to: '/' },
            { label: t('footer', 'links')?.privacy || 'Privacy Policy', to: '/privacy-policy' },
            { label: t('footer', 'terms') || 'Terms of Use', to: '/terms-of-use' },
            { label: t('auth', 'socialOr') === 'या इनका इस्तेमाल करें' ? 'क्रेडिट कार्ड' : 'Credit Cards', action: () => showAlert({ title: t('auth', 'socialOr') === 'या इनका इस्तेमाल करें' ? 'क्रेडिट कार्ड' : "Credit Cards", text: t('auth', 'socialOr') === 'या इनका इस्तेमाल करें' ? " TrueValue क्रेडिट कार्ड के लिए दुकान में आएं या 1-800-TRUEVALUE पर फोन करें" : "Apply for a TrueValue credit card in-store or call 1-800-TRUEVALUE", icon: "info" }) },
        ]
    };

    return (
        <footer className="bg-white border-t border-gray-100 py-16 font-display">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 text-primary mb-8 cursor-pointer group"
                        >
                            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                <Package size={22} className="transition-transform group-hover:scale-110" />
                            </div>
                            <h2 className="text-gray-900 text-xl font-black leading-tight tracking-tight uppercase">TrueValue</h2>
                        </Link>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                            {footerContent.company.description}
                        </p>
                        <div className="flex gap-3">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                                <button key={idx} className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-900">{t('footer', 'customerService')}</h4>
                        <ul className="text-sm font-bold text-gray-500 space-y-4">
                            {navLinks.customerService.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-900">{t('footer', 'resources')}</h4>
                        <ul className="text-sm font-bold text-gray-500 space-y-4">
                            {navLinks.resources.map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-900">{t('footer', 'shop')}</h4>
                        <ul className="text-sm font-bold text-gray-500 space-y-4">
                            {navLinks.shop.map((link, idx) => (
                                <li key={idx}>
                                    {link.to ? (
                                        <Link to={link.to} className="hover:text-primary transition-colors">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <button onClick={link.action} className="hover:text-primary transition-colors text-left uppercase text-[10px] tracking-widest">
                                            {link.label}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <h4 className="font-black mb-6 text-sm uppercase tracking-widest text-gray-900">{t('footer', 'newsletter')}</h4>
                        <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
                            {t('footer', 'newsletterText')}
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); showAlert({ title: "Joined!", text: "You've successfully subscribed to our newsletter.", icon: "success" }); }}>
                            <input
                                className="w-full rounded-2xl border-none bg-gray-50 py-3.5 px-5 text-sm font-medium focus:ring-2 focus:ring-primary placeholder-gray-400 text-gray-900 shadow-inner"
                                placeholder={t('footer', 'emailPlaceholder')}
                                type="email"
                                required
                            />
                            <button className="bg-primary py-3.5 rounded-2xl font-black text-xs text-white hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20 uppercase tracking-widest">
                                {t('footer', 'subscribe')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <p>{t('footer', 'rights')}</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <Link to="/privacy-policy" className="hover:text-primary transition-colors">{t('footer', 'privacy')}</Link>
                        <Link to="/terms-of-use" className="hover:text-primary transition-colors">{t('footer', 'terms')}</Link>
                        <Link to="/help-center" className="hover:text-primary transition-colors">{t('footer', 'accessibility')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default HomeFooter;
