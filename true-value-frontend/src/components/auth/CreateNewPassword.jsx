import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Shield, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

const CreateNewPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('Weak');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("password", "");

    useEffect(() => {
        let score = 0;
        if (password.length >= 8) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;

        setStrength(score);
        if (score < 50) setStrengthLabel('Weak');
        else if (score < 80) setStrengthLabel('Medium');
        else setStrengthLabel('Strong');
    }, [password]);

    const onSubmit = data => {
        console.log("Password Reset Successful");
        navigate('/reset-success');
    };

    return (
        <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gray-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[480px] bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden"
            >
                <div className="pt-10 px-8 text-center">
                    <h1 className="text-gray-900 tracking-tight text-3xl font-black leading-tight font-display">Create New Password</h1>
                    <p className="text-gray-500 text-sm font-medium leading-normal pt-2 px-4">
                        Please enter your new password below. Make sure it's at least 8 characters long and includes numbers.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <InputField
                        label="New Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={Lock}
                        register={register}
                        error={errors.password}
                        rules={{
                            required: "Password is required",
                            minLength: { value: 8, message: "Minimum 8 characters" }
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

                    {/* Strength Meter */}
                    <div className="flex flex-col gap-2 py-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 text-xs font-bold uppercase tracking-wider">Strength</p>
                            <p className={`text-xs font-black uppercase tracking-wider ${strengthLabel === 'Strong' ? 'text-primary' : strengthLabel === 'Medium' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {strengthLabel}
                            </p>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${strength}%` }}
                                className={`h-full rounded-full transition-colors duration-500 ${strengthLabel === 'Strong' ? 'bg-primary' : strengthLabel === 'Medium' ? 'bg-gray-400' : 'bg-gray-300'}`}
                            />
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                            {strength >= 80 ? (
                                <CheckCircle2 className="text-primary w-3 h-3" />
                            ) : (
                                <Shield className="text-gray-400 w-3 h-3" />
                            )}
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Includes symbols & numbers</p>
                        </div>
                    </div>

                    <InputField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        icon={Lock}
                        register={register}
                        error={errors.confirmPassword}
                        rules={{
                            required: "Please confirm your password",
                            validate: value => value === password || "Passwords do not match"
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

                    <Button type="submit" className="w-full h-14 font-black tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                        Reset Password
                    </Button>

                    <div className="text-center pt-2">
                        <Link
                            to="/login"
                            className="text-gray-500 text-sm font-bold hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </form>

                {/* Success Banner */}
                {strength >= 80 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-primary/5 border-t border-primary/10 p-4 flex items-center justify-center gap-3"
                    >
                        <div className="flex-shrink-0 bg-primary/20 rounded-full p-1">
                            <CheckCircle2 size={12} className="text-primary" />
                        </div>
                        <p className="text-primary text-xs font-black uppercase tracking-wider">Your password is secure</p>
                    </motion.div>
                )}
            </motion.div>
        </main>
    );
};

export default CreateNewPassword;
