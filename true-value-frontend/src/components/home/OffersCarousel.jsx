import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProducts } from '../../context/ProductsContext';

const OffersCarousel = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { banners } = useProducts();
    const [currentIndex, setCurrentIndex] = useState(0);

    const localizedSlides = t('offers', 'slides') || [];

    // Filter dynamic offer banners
    const dynamicBanners = banners?.filter(b => b.type === 'offer' && b.isActive) || [];

    const offers = dynamicBanners.length > 0 ? dynamicBanners.map(b => ({
        id: b._id,
        title: b.title,
        subtitle: b.subtitle,
        description: b.description || "",
        image: b.image,
        link: b.link || '/deals'
    })) : [
        {
            id: 1,
            title: localizedSlides[0]?.title || "Summer Fresh Sale",
            subtitle: localizedSlides[0]?.subtitle || "Up to 50% Off on Fruits",
            description: localizedSlides[0]?.description || "Get the freshest organic picks delivered from local farms to your door.",
            image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2600&auto=format&fit=crop",
            color: "bg-emerald-500",
        },
        {
            id: 2,
            title: localizedSlides[1]?.title || "Super Saver Deals",
            subtitle: localizedSlides[1]?.subtitle || "Flat 20% Off on Groceries",
            description: localizedSlides[1]?.description || "Stock up on pantry essentials with our weekly super saver discounts.",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2600&auto=format&fit=crop",
            color: "bg-[#5EC401]",
        },
        {
            id: 3,
            title: localizedSlides[2]?.title || "Healthy Mornings",
            subtitle: localizedSlides[2]?.subtitle || "Dairy & Bakery Combo Deals",
            description: localizedSlides[2]?.description || "Fuel your day with our high-protein dairy and freshly baked goodies.",
            image: "https://images.unsplash.com/photo-1550583760-d80392dc8994?q=80&w=2600&auto=format&fit=crop",
            color: "bg-amber-600",
        }
    ];

    useEffect(() => {
        if (offers.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [offers.length]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % offers.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);

    if (offers.length === 0) return null;

    return (
        <section className="mx-auto max-w-[1440px] px-4 md:px-6 py-6 font-display">
            <div className="relative rounded-[40px] overflow-hidden h-[350px] md:h-[450px] shadow-premium group border border-gray-100/50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <img
                            src={offers[currentIndex].image}
                            alt={offers[currentIndex].title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 md:px-16 lg:px-24">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="max-w-2xl space-y-4 md:space-y-6"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5EC401]/90 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-lg shadow-[#5EC401]/20">
                                    <Tag size={12} />
                                    {t('offers', 'flashLabel')}
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95] drop-shadow-xl">
                                    {offers[currentIndex].title}
                                </h2>
                                <p className="text-xl md:text-2xl font-bold text-[#5EC401] tracking-tight drop-shadow-md">
                                    {offers[currentIndex].subtitle}
                                </p>
                                <p className="text-white/80 text-sm md:text-base font-medium max-w-lg hidden sm:block leading-relaxed">
                                    {offers[currentIndex].description}
                                </p>
                                <button
                                    onClick={() => navigate(offers[currentIndex].link || '/deals')}
                                    className="mt-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-[#5EC401] hover:text-white transition-all duration-300 shadow-xl w-fit group/btn text-sm"
                                >
                                    {t('offers', 'grabLabel')} <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Indicators */}
                <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 flex gap-2 z-10">
                    {offers.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#5EC401]' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>

                {/* Nav */}
                <div className="absolute bottom-8 right-8 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevSlide} className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-[#5EC401] text-white transition-all flex items-center justify-center border border-white/20">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlide} className="size-10 rounded-xl bg-white/20 backdrop-blur-md hover:bg-[#5EC401] text-white transition-all flex items-center justify-center border border-white/20">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OffersCarousel;
