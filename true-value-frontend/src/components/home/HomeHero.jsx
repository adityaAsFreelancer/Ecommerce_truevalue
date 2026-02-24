import React from 'react';
import { MapPin, Star } from 'lucide-react';
import FreshSearch from '../common/FreshSearch';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useLanguage } from '../../context/LanguageContext';

const HomeHero = ({ content }) => {
    const navigate = useNavigate();
    const { handleSearch, banners } = useProducts();
    const { t } = useLanguage();

    // Use dynamic banner if available, otherwise fallback to prop content
    const heroBanner = banners?.find(b => b.type === 'hero' && b.isActive) || content;

    if (!heroBanner && !content) return null;

    const onSearchSubmit = (query) => {
        handleSearch(query);
        navigate('/products');
    };

    return (
        <section className="mx-auto max-w-[1440px] px-4 md:px-6 pt-4 mb-6">
            <div className="relative overflow-hidden rounded-[40px] bg-[#F3FCE9] border border-[#E2F2D1]/50 shadow-sm">
                <div className="flex flex-col md:flex-row items-center relative z-10 px-6 py-8 md:p-12 gap-8 md:gap-12">
                    {/* Content Side */}
                    <div className="flex-1 text-center md:text-left space-y-6 max-w-2xl">
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 leading-[0.95]">
                                {heroBanner.title ? (
                                    <>
                                        <span className="text-[#5EC401]">{heroBanner.title.split(' ')[0]}</span> {heroBanner.title.split(' ').slice(1).join(' ')}
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[#5EC401]">{t('hero', 'fresh')}</span>{t('hero', 'groceries')} <br />
                                        {t('hero', 'deliveredFast')}
                                    </>
                                )}
                            </h1>
                            <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed md:max-w-md mx-auto md:mx-0">
                                {heroBanner.subtitle || t('hero', 'subtitle')}
                            </p>

                            <div className="pt-2 md:pt-4">
                                <FreshSearch onSearch={onSearchSubmit} />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50">
                                <div className="size-2 rounded-full bg-[#5EC401] animate-pulse" />
                                <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider">{t('hero', 'freeDelivery')}</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50">
                                <Star size={14} className="text-primary fill-primary" />
                                <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider">{t('hero', 'rating')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/40 blur-[80px] rounded-full pointer-events-none" />

                            <img
                                src={heroBanner.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"}
                                alt={heroBanner.title || "Fresh Groceries"}
                                className="w-[90%] h-[90%] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700"
                                loading="eager"
                                decoding="async"
                            />

                            <div className="absolute bottom-6 right-0 md:left-0 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 hidden sm:block animate-bounce-slow">
                                <div className="flex items-center gap-2">
                                    <div className="bg-[#5EC401]/10 p-1.5 rounded-lg text-[#5EC401]">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-[#5EC401]">{t('hero', 'deliveringTo')}</div>
                                        <div className="text-xs font-black text-gray-900">{t('hero', 'yourLocation')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
