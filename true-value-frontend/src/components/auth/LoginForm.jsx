import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import showAlert from '../../utils/swal';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useUser();
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await login(data);

            // Professional Redirection Logic
            const userRole = response.data?.role || response.role;
            const targetPath = userRole === 'admin' ? '/admin' : '/profile';

            showAlert({
                title: t('auth', 'loginTitle') + '!',
                text: t('auth', 'loginSubtitle'),
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                navigate(targetPath);
            });
        } catch (error) {
            showAlert({
                title: t('errors', 'systemError'),
                text: error.message || 'Authentication Failed',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] bg-white shadow-premium rounded-[32px] overflow-hidden border border-gray-100 p-8 md:p-10"
            >
                <div className="pb-8 text-center space-y-2">
                    <h1 className="text-gray-900 tracking-tight text-3xl md:text-4xl font-black leading-tight">{t('auth', 'loginTitle')}</h1>
                    <p className="text-gray-500 text-base font-medium">{t('auth', 'loginSubtitle')}</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <InputField
                        label={t('auth', 'emailLabel')}
                        name="email"
                        type="email"
                        placeholder="admin@truevalue.com"
                        icon={Mail}
                        register={register}
                        error={errors.email}
                        rules={{
                            required: t('errors', 'required'),
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: t('errors', 'invalidEmail')
                            }
                        }}
                    />

                    <div className="space-y-1">
                        <InputField
                            label={t('auth', 'passwordLabel')}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            icon={Lock}
                            register={register}
                            error={errors.password}
                            rules={{
                                required: t('errors', 'required'),
                                minLength: { value: 6, message: t('errors', 'shortPassword') }
                            }}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="px-3 h-full text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            }
                        />
                        <div className="flex justify-end pt-1">
                            <Link
                                to="/forgot-password"
                                className="text-primary text-xs font-black uppercase tracking-wider hover:text-primary-hover transition-colors cursor-pointer"
                            >
                                {t('auth', 'forgotPassword')}
                            </Link>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center size-5">
                            <input
                                {...register("remember")}
                                className="peer appearance-none size-5 border-2 border-gray-200 rounded-lg checked:bg-primary checked:border-primary transition-all duration-300 cursor-pointer bg-white"
                                id="remember"
                                type="checkbox"
                            />
                            <svg className="absolute size-3 text-white pointer-events-none hidden peer-checked:block transition-all duration-300 transform scale-0 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <label className="text-sm text-gray-600 font-medium cursor-pointer" htmlFor="remember">{t('auth', 'rememberMe')}</label>
                    </div>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full h-14 text-base font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                    >
                        {t('auth', 'loginButton')}
                    </Button>
                </form>

                {/* Social Logins */}
                <div className="pt-8 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                            <span className="bg-white px-4 text-gray-400">{t('auth', 'socialOr')}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="h-12 flex items-center justify-center gap-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                            </svg>
                            Google
                        </button>
                        <button className="h-12 flex items-center justify-center gap-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-gray-700 text-sm">
                            <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm font-medium">
                            {t('auth', 'noAccount')}
                            <Link
                                to="/signup"
                                className="text-primary font-bold hover:text-primary-hover hover:underline ml-1 cursor-pointer transition-colors"
                            >
                                {t('auth', 'signupButton')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default LoginForm;
