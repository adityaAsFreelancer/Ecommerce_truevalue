import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log("Reset Request for:", data.email);
        navigate('/email-sent');
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] bg-white rounded-[32px] shadow-premium border border-gray-100 p-8 md:p-10"
            >
                {/* Branding Icon in Card */}
                <div className="flex justify-center mb-6">
                    <div className="bg-primary/10 p-4 rounded-2xl shadow-inner">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                </div>

                {/* Headline Section */}
                <div className="flex flex-col text-center mb-2">
                    <h1 className="text-gray-900 tracking-tight text-[28px] md:text-3xl font-black leading-tight font-display">
                        Reset Password
                    </h1>
                </div>

                {/* Body Text */}
                <div className="flex flex-col text-center mb-8">
                    <p className="text-gray-500 text-base font-medium leading-relaxed px-4">
                        Enter the email address associated with your TrueValue account and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="e.g., alex@email.com"
                        icon={Mail}
                        register={register}
                        error={errors.email}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email"
                            }
                        }}
                    />

                    <Button type="submit" className="w-full h-14 font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all" icon={ArrowRight}>
                        Send Reset Link
                    </Button>
                </form>

                {/* Navigation Link (Back to Login) */}
                <div className="mt-8 flex justify-center">
                    <Link
                        to="/login"
                        className="group flex items-center gap-2 text-gray-500 text-sm font-bold hover:text-primary transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};

export default ResetPasswordForm;
