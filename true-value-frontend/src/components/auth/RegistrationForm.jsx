import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import showAlert from '../../utils/swal';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { login, registerUser } = useUser();
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        setIsSubmitting(true);
        try {
            await registerUser(data); // Call backend registration
            showAlert({
                title: t('auth', 'signupTitle') + '!',
                text: t('auth', 'signupSubtitle'),
                icon: 'success'
            }).then(() => {
                navigate('/');
            });
        } catch (error) {
            showAlert({ title: t('errors', 'systemError'), text: error.message, icon: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const password = watch("password", "");

    return (
        <div className="w-full bg-gray-50/50 flex items-center justify-center p-6 sm:p-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] bg-white shadow-premium rounded-[32px] overflow-hidden border border-gray-100 p-8 md:p-10"
            >
                <div className="pb-8 text-center space-y-2">
                    <h2 className="text-gray-900 tracking-tight text-3xl font-black leading-tight font-display">{t('auth', 'signupTitle')}</h2>
                    <p className="text-gray-500 font-medium">{t('auth', 'signupSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <InputField
                        label={t('auth', 'nameLabel')}
                        name="fullName"
                        placeholder="Full Name"
                        icon={User}
                        register={register}
                        error={errors.fullName}
                        rules={{
                            required: t('errors', 'required'),
                            minLength: { value: 3, message: 'Name must be at least 3 characters' },
                            pattern: { value: /^[a-zA-Z ]+$/, message: 'Name can only contain letters' }
                        }}
                    />

                    <InputField
                        label={t('auth', 'emailLabel')}
                        name="email"
                        type="email"
                        placeholder="example@email.com"
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
                            minLength: { value: 8, message: t('errors', 'shortPassword') },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must include uppercase, lowercase, number and special character'
                            }
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

                    <InputField
                        label={t('auth', 'passwordLabel')} // Simple re-use or just "Confirm"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-type your password"
                        icon={Lock}
                        register={register}
                        error={errors.confirmPassword}
                        rules={{
                            required: t('errors', 'required'),
                            validate: value => value === password || t('errors', 'noMatch')
                        }}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="px-3 h-full text-gray-400 hover:text-primary transition-colors cursor-pointer"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                    />

                    {/* Newsletter Checkbox */}
                    <div className="flex items-start gap-3 py-2">
                        <div className="relative flex items-start pt-1 justify-center size-5">
                            <input
                                {...register("newsletter")}
                                className="peer appearance-none size-5 border-2 border-gray-200 rounded-lg checked:bg-primary checked:border-primary transition-all duration-300 cursor-pointer bg-white"
                                id="newsletter"
                                type="checkbox"
                            />
                            <svg className="absolute top-1 size-3 text-white pointer-events-none hidden peer-checked:block transition-all duration-300 transform scale-0 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <label className="text-sm text-gray-500 font-medium leading-normal cursor-pointer" htmlFor="newsletter">
                            {t('auth', 'newsletterNotice')}
                        </label>
                    </div>

                    {/* Terms Notice */}
                    <p className="text-xs text-center text-gray-400 font-medium">
                        {t('auth', 'agreeTerms')} <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-2" to="/terms-of-use">{t('auth', 'termsOfService')}</Link> and <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-2" to="/privacy-policy">{t('auth', 'privacyPolicy')}</Link>.
                    </p>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        className="w-full h-14 text-base font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
                    >
                        {t('auth', 'signupButton')}
                    </Button>

                    <div className="text-center pt-2">
                        <p className="text-gray-500 text-sm font-medium">
                            {t('auth', 'hasAccount')}
                            <Link
                                to="/login"
                                className="text-primary font-bold hover:text-primary-hover hover:underline ml-1 cursor-pointer transition-colors"
                            >
                                {t('auth', 'loginButton')}
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegistrationForm;
