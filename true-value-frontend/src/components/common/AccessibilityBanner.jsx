import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const AccessibilityBanner = () => {
    const { language, toggleLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show to users who haven't interacted with it yet
        const dismissed = localStorage.getItem('tv_accessibility_dismissed');
        if (!dismissed) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [language]);

    const handleAction = () => {
        if (language === 'en') {
            toggleLanguage();
        }
        localStorage.setItem('tv_accessibility_dismissed', 'true');
        setIsVisible(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('tv_accessibility_dismissed', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="fixed top-24 left-4 right-4 z-[100] md:left-1/2 md:-translate-x-1/2 md:max-w-xl"
                >
                    <div className="bg-white border-2 border-primary shadow-2xl rounded-3xl overflow-hidden relative p-5 flex flex-col items-center text-center gap-4">
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-900"
                        >
                            <X size={16} />
                        </button>

                        <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1">
                            <Languages size={32} />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">हिन्दी में इस्तेमाल करें?</h2>
                            <p className="text-gray-500 font-bold leading-tight">क्या आप यह ऐप हिन्दी में चलाना चाहते हैं?</p>
                        </div>

                        <div className="flex w-full gap-3 mt-2">
                            <button
                                onClick={handleAction}
                                className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={24} />
                                हाँ, शुरू करें
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-6 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-lg border border-gray-100"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AccessibilityBanner;
