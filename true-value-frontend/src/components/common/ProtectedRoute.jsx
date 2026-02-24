import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAuthenticated } = useUser();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-6">
                <div className="animate-spin size-12 border-[6px] border-primary/20 border-t-primary rounded-full" />
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs italic">Authenticating Protocol...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        // If they are authenticated but not an admin, redirect to home or a forbidden page
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
