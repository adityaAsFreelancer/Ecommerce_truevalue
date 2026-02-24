import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, onHeaderAction, headerActionLabel }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 transition-colors duration-500">
            <Header onAction={onHeaderAction} actionLabel={headerActionLabel} />

            <main className="flex-grow flex flex-col lg:flex-row">
                {children}
            </main>

            <Footer />
        </div>

    );
};

export default AuthLayout;
