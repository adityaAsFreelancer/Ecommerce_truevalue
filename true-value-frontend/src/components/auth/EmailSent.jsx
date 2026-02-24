import React from 'react';
import { MailCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const EmailSent = ({ email = "user@email.com" }) => {
    const navigate = useNavigate();

    return (
        <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col max-w-[480px] w-full bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden"
            >
                {/* Image / Illustration Component */}
                <div className="flex w-full p-8 pb-2 justify-center pt-10">
                    <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <MailCheck className="text-primary w-12 h-12" />
                    </div>
                </div>

                {/* Headline Section */}
                <h1 className="text-gray-900 tracking-tight text-3xl font-black leading-tight px-8 text-center pb-3 pt-6 font-display">
                    Check your email
                </h1>

                {/* Body Text Section */}
                <div className="px-8 text-center">
                    <p className="text-gray-500 text-base font-medium leading-relaxed pb-2">
                        We've sent a password reset link to <span className="font-bold text-primary">{email}</span>. Please click the link in the email to create a new password.
                    </p>
                </div>

                {/* Meta Text Section */}
                <div className="px-8 text-center pb-8 border-b border-gray-100 mb-6">
                    <p className="text-gray-400 text-sm font-medium leading-normal bg-gray-50 py-3 rounded-xl">
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="px-8 pb-10 flex flex-col gap-3">
                    <Button
                        onClick={() => navigate('/create-password')}
                        className="w-full h-14 font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                        icon={RefreshCw}
                    >
                        Resend Email
                    </Button>

                    <Link
                        to="/login"
                        className="w-full h-12 flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-primary hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};

export default EmailSent;
