import React from 'react';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const PasswordResetSuccess = () => {
    const navigate = useNavigate();

    return (
        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="layout-content-container flex flex-col max-w-[520px] w-full bg-white rounded-[40px] shadow-premium overflow-hidden border border-gray-100"
            >
                {/* Success Icon Section */}
                <div className="pt-12 flex justify-center">
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.5 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="relative bg-primary text-white rounded-2xl p-6 flex items-center justify-center shadow-lg shadow-primary/30"
                        >
                            <CheckCircle2 className="w-16 h-16" strokeWidth={2.5} />
                        </motion.div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="pt-10">
                    <motion.h4
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-primary text-xs font-black leading-normal tracking-[0.2em] uppercase px-4 text-center"
                    >
                        Update Successful
                    </motion.h4>
                </div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-900 tracking-tight text-3xl md:text-4xl font-black leading-tight px-8 text-center pb-3 pt-2 font-display"
                >
                    Password Updated!
                </motion.h1>

                {/* Body Text */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-500 text-base font-medium leading-relaxed pb-8 pt-1 px-10 text-center"
                >
                    Your security is our priority. You can now sign in to your TrueValue account using your new credentials and get back to your projects.
                </motion.p>

                {/* Action Buttons Section */}
                <div className="px-10 pb-12 flex flex-col gap-3">
                    <Button
                        onClick={() => navigate('/login')}
                        className="w-full h-14 text-lg font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                        icon={ArrowRight}
                    >
                        Go to Login
                    </Button>

                    <Button
                        onClick={() => navigate('/')}
                        variant="ghost"
                        className="w-full h-12 text-gray-500 font-bold hover:text-primary hover:bg-gray-50"
                        icon={Home}
                    >
                        Return to Home
                    </Button>
                </div>

                {/* Footer Meta */}
                <div className="bg-gray-50 py-5 px-10 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400 font-medium">
                        Did not request this change? <button className="text-primary font-bold hover:underline cursor-pointer">Secure your account</button>
                    </p>
                </div>
            </motion.div>
        </main>
    );
};

export default PasswordResetSuccess;
