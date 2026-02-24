import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const WhatsAppOrderButton = () => {
    const { language } = useLanguage();

    const handleClick = () => {
        const phoneNumber = "919000000000"; // Placeholder
        const message = language === 'hi'
            ? "नमस्ते! मुझे सामान खरीदने में मदद चाहिए।"
            : "Hello! I need help placing an order.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="fixed bottom-24 right-5 md:bottom-10 md:right-10 z-[60] flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-full font-black shadow-2xl shadow-green-500/30 group"
        >
            <div className="size-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} fill="white" />
            </div>
            <div className="text-left leading-tight hidden sm:block">
                <span className="text-[10px] opacity-70 uppercase tracking-widest block">
                    {language === 'hi' ? 'सीधा संपर्क' : 'DIRECT HELP'}
                </span>
                <span className="text-sm">
                    {language === 'hi' ? 'वॉट्सऐप पर ऑर्डर करें' : 'Order on WhatsApp'}
                </span>
            </div>

            {/* PULSE EFFECT */}
            <span className="absolute inset-0 rounded-full bg-green-400 -z-10 animate-ping opacity-20 group-hover:opacity-40" />
        </motion.button>
    );
};

export default WhatsAppOrderButton;
