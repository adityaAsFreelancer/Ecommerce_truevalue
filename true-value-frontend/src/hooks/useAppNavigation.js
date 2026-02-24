import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that provides all navigation handlers for the application.
 * This centralizes navigation logic and makes it easy to use throughout the app.
 */
export const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        // Core navigation
        onNavigateToHome: () => navigate('/'),
        onNavigateToProducts: () => navigate('/products'),
        onNavigateToProductDetails: (productId) => navigate(`/products/${productId}`),

        // User & Account
        onNavigateToProfile: () => navigate('/profile'),
        onNavigateToAddresses: () => navigate('/addresses'),
        onNavigateToWishlist: () => navigate('/wishlist'),
        onNavigateToOrders: () => navigate('/profile'), // Orders are in profile

        // Support & Help
        onNavigateToContact: () => navigate('/contact'),
        onNavigateToShipping: () => navigate('/shipping-policy'),
        onNavigateToFAQ: () => navigate('/faq'),
        onNavigateToHelp: () => navigate('/help-center'),
        onNavigateToPrivacy: () => navigate('/privacy-policy'),
        onNavigateToTerms: () => navigate('/terms-of-use'),

        // Order Tracking
        onNavigateToTracking: () => navigate('/tracking-search'),
        onNavigateToTrackingSearch: () => navigate('/tracking-search'),
        onNavigateToOrderTracking: (orderId) => {
            if (orderId) {
                navigate(`/order-tracking/${orderId}`);
            } else {
                navigate('/order-tracking');
            }
        },

        // Shopping & Features
        onNavigateToDeals: () => navigate('/deals'),
        onNavigateToStores: () => navigate('/stores'),
        onNavigateToTips: () => navigate('/tips'),
        onNavigateToProjects: () => navigate('/projects'),
        onNavigateToRewards: () => navigate('/rewards'),
        onNavigateToCalculator: () => navigate('/calculator'),
        onNavigateToSavedProjects: () => navigate('/saved-projects'),

        // Auth
        onNavigateToLogin: () => navigate('/login'),
        onNavigateToSignup: () => navigate('/signup'),
        onNavigateToForgotPassword: () => navigate('/forgot-password'),

        // Utility
        onNavigateBack: () => navigate(-1),
        onNavigateForward: () => navigate(1),
    };
};
