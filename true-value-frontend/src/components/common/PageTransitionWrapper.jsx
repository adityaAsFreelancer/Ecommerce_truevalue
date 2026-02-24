import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransitionWrapper = ({ children }) => {
    const location = useLocation();
    const containerRef = useRef(null);

    useEffect(() => {
        // Instant visual feedback for route change
        window.scrollTo({ top: 0, behavior: 'auto' });

        if (containerRef.current) {
            containerRef.current.classList.remove('opacity-0');
            containerRef.current.classList.add('animate-in', 'fade-in', 'duration-500');
        }
    }, [location.pathname]);

    return (
        <div ref={containerRef} key={location.pathname} className="min-h-screen w-full">
            {children}
        </div>
    );
};

export default PageTransitionWrapper;
