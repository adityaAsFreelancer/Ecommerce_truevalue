import React, { useEffect } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import HeroSection from '../components/common/HeroSection';
import LoginForm from '../components/auth/LoginForm';
import RegistrationForm from '../components/auth/RegistrationForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import EmailSent from '../components/auth/EmailSent';
import CreateNewPassword from '../components/auth/CreateNewPassword';
import PasswordResetSuccess from '../components/auth/PasswordResetSuccess';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ page }) => {
    const navigate = useNavigate();
    const isLoginPage = page === 'login';
    const isSignUpPage = page === 'signup';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [page]);

    const handleHeaderAction = () => {
        navigate(isLoginPage ? '/signup' : '/login');
    };

    const headerLabel = isLoginPage ? 'Sign Up' : 'Login';

    return (
        <AuthLayout onHeaderAction={handleHeaderAction} headerActionLabel={headerLabel}>
            {isSignUpPage ? (
                <>
                    <HeroSection />
                    <RegistrationForm />
                </>
            ) : page === 'forgot' ? (
                <ResetPasswordForm />
            ) : page === 'email-sent' ? (
                <EmailSent />
            ) : page === 'create-password' ? (
                <CreateNewPassword />
            ) : page === 'reset-success' ? (
                <PasswordResetSuccess />
            ) : (
                <LoginForm />
            )}
        </AuthLayout>
    );
};

export default AuthPage;
