import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = ({ loading, message = 'Loading...' }) => {
    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="global-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-lg"
                >
                    {/* Animated Ring Stack */}
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Outer pulsing ring */}
                        <motion.div
                            className="absolute rounded-full border-4 border-primary/10"
                            style={{ width: 120, height: 120 }}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {/* Mid spinning gradient ring */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                width: 90,
                                height: 90,
                                background: 'conic-gradient(from 0deg, #5EC401, #eef9e6, #5EC401)',
                                borderRadius: '50%',
                                padding: 3,
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        >
                            <div className="w-full h-full bg-white rounded-full" />
                        </motion.div>
                        {/* Logo / Brand mark in center */}
                        <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/30">
                            <span className="text-white font-black text-2xl tracking-tight select-none">TV</span>
                        </div>
                    </div>

                    {/* Message */}
                    <motion.p
                        className="text-gray-900 font-black text-lg uppercase tracking-widest"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {message}
                    </motion.p>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2 mt-4">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-primary"
                                animate={{ scale: [1, 1.6, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoader;
