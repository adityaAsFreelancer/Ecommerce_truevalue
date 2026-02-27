import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { cmsContent } from './data/siteData';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { UserProvider, useUser } from './context/UserContext';
import { ProductsProvider } from './context/ProductsContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import GlobalLoader from './components/common/GlobalLoader';
import { PageSpinner } from './components/common/Loaders';

// ─── Eagerly loaded (always needed) ──────────────────────────────────────────
import CartDrawer from './components/cart/CartDrawer';
import { ScrollToTop } from './components/common/ScrollToTop';
import BottomNav from './components/layout/BottomNav';
import WhatsAppOrderButton from './components/common/WhatsAppOrderButton';
import AccessibilityBanner from './components/common/AccessibilityBanner';
import NotificationToastHandler from './components/common/NotificationToastHandler';
import PageTransitionWrapper from './components/common/PageTransitionWrapper';

// Lazy load heavy components (HomeFooter, ChatWidget)
const HomeFooter = lazy(() => import('./components/home/HomeFooter'));
const ChatWidget = lazy(() => import('./components/common/ChatWidget'));

// ─── Lazy-loaded User Pages ───────────────────────────────────────────────────
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProductListingPage = lazy(() => import('./pages/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AddressPage = lazy(() => import('./pages/AddressPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const OrderTrackingSearchPage = lazy(() => import('./pages/OrderTrackingSearchPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const DealsPage = lazy(() => import('./pages/DealsPage'));
const ProjectGalleryPage = lazy(() => import('./pages/ProjectGalleryPage'));
const RewardsPage = lazy(() => import('./pages/RewardsPage'));
const SavedProjectsPage = lazy(() => import('./pages/SavedProjectsPage'));
const StoreLocatorPage = lazy(() => import('./pages/StoreLocatorPage'));
const TipsAdvicePage = lazy(() => import('./pages/TipsAdvicePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProjectCalculatorPage = lazy(() => import('./pages/ProjectCalculatorPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));

// ─── Lazy-loaded Admin Pages ──────────────────────────────────────────────────
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductList = lazy(() => import('./pages/admin/AdminProductList'));
const AdminOrderList = lazy(() => import('./pages/admin/AdminOrderList'));
const AdminUserList = lazy(() => import('./pages/admin/AdminUserList'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'));
const AdminCategoryList = lazy(() => import('./pages/admin/AdminCategoryList'));
const AdminBannerManager = lazy(() => import('./pages/admin/AdminBannerManager'));
const AdminCouponManager = lazy(() => import('./pages/admin/AdminCouponManager'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Fallback for lazy pages
const PageFallback = () => <PageSpinner message="Loading..." />;

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const { loading: authLoading } = useUser();

  if (authLoading) {
    return <GlobalLoader loading={true} message="True Value" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <AccessibilityBanner />
      <NotificationToastHandler />

      <Suspense fallback={<PageFallback />}>
        <PageTransitionWrapper>
          <Routes>
            {/* ── User Routes ─────────────────────────────── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/tracking-search" element={<OrderTrackingSearchPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/addresses" element={<ProtectedRoute><AddressPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/calculator" element={<ProjectCalculatorPage />} />
            <Route path="/projects" element={<ProjectGalleryPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/saved-projects" element={<SavedProjectsPage />} />
            <Route path="/stores" element={<StoreLocatorPage />} />
            <Route path="/tips" element={<TipsAdvicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />

            {/* ── Auth Routes ─────────────────────────────── */}
            <Route path="/login" element={<AuthPage page="login" />} />
            <Route path="/signup" element={<AuthPage page="signup" />} />
            <Route path="/forgot-password" element={<AuthPage page="forgot" />} />
            <Route path="/email-sent" element={<AuthPage page="email-sent" />} />
            <Route path="/create-password" element={<AuthPage page="create-password" />} />
            <Route path="/reset-success" element={<AuthPage page="reset-success" />} />

            {/* ── Admin Routes ─────────────────────────────── */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProductList />} />
                    <Route path="products/new" element={<AdminProductForm />} />
                    <Route path="products/edit/:id" element={<AdminProductForm />} />
                    <Route path="orders" element={<AdminOrderList />} />
                    <Route path="orders/:id" element={<AdminOrderDetails />} />
                    <Route path="users" element={<AdminUserList />} />
                    <Route path="categories" element={<AdminCategoryList />} />
                    <Route path="banners" element={<AdminBannerManager />} />
                    <Route path="coupons" element={<AdminCouponManager />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </PageTransitionWrapper>
      </Suspense>

      {!isAdminPath && (
        <Suspense fallback={null}>
          <BottomNav />
          <WhatsAppOrderButton />
          <CartDrawer />
          <HomeFooter footerContent={cmsContent.footer} />
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <UserProvider>
          <ProductsProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </BrowserRouter>
          </ProductsProvider>
        </UserProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;
