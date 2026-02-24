import React from 'react';
import { motion } from 'framer-motion';
import showAlert from '../../utils/swal';

const PromoBanners = ({ banners }) => {
    const handleAction = (feature) => {
        showAlert({
            title: 'Coming Soon!',
            text: `The ${feature} portal is currently under development.`,
            icon: 'info'
        });
    };

    if (!banners) return null;

    return (
        <section className="mx-auto max-w-[1440px] px-4 md:px-8 py-20 lg:py-24">
            <div className="grid md:grid-cols-2 gap-10">
                {/* Banner 1: Project Inspiration */}
                <motion.div
                    className="relative h-[480px] rounded-[40px] overflow-hidden group cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-500"
                    onClick={() => handleAction('Inspiration')}
                    whileHover={{ y: -8 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={banners.inspiration.image}
                        alt="Project Inspiration"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[10%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-12">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-lg border border-white/10">Inspiration</div>
                            <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight whitespace-pre-line">{banners.inspiration.title}</h3>
                            <p className="text-lg font-medium text-white/80 mb-8 max-w-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                {banners.inspiration.subtitle}
                            </p>
                            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                                {banners.inspiration.cta}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Banner 2: Pro Services */}
                <motion.div
                    className="relative h-[480px] rounded-[40px] overflow-hidden group cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-500"
                    onClick={() => handleAction('Pro Services')}
                    whileHover={{ y: -8 }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={banners.pro.image}
                        alt="Pro Services"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale-[10%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-12">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-3 bg-primary/80 backdrop-blur-md w-fit px-3 py-1 rounded-lg shadow-lg shadow-primary/20">For Pros</div>
                            <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight whitespace-pre-line">{banners.pro.title}</h3>
                            <p className="text-lg font-medium text-white/80 mb-8 max-w-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                {banners.pro.subtitle}
                            </p>
                            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 active:scale-95">
                                {banners.pro.cta}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

    );
};

export default PromoBanners;
