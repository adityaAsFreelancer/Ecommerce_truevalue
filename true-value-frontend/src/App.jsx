import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import AddressPage from './pages/AddressPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import UserProfilePage from './pages/UserProfilePage';
import WishlistPage from './pages/WishlistPage';
import DealsPage from './pages/DealsPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import RewardsPage from './pages/RewardsPage';
import SavedProjectsPage from './pages/SavedProjectsPage';
import StoreLocatorPage from './pages/StoreLocatorPage';
import TipsAdvicePage from './pages/TipsAdvicePage';
import ContactPage from './pages/ContactPage';
import OrderTrackingSearchPage from './pages/OrderTrackingSearchPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import FAQPage from './pages/FAQPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import { cmsContent } from './data/siteData';
import CartDrawer from './components/cart/CartDrawer';
import ChatWidget from './components/common/ChatWidget';
import ProjectCalculatorPage from './pages/ProjectCalculatorPage';
import HomeFooter from './components/home/HomeFooter';
import { ScrollToTop } from './components/common/ScrollToTop';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminProductList from './pages/admin/AdminProductList';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminUserList from './pages/admin/AdminUserList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminCategoryList from './pages/admin/AdminCategoryList';
import AdminBannerManager from './pages/admin/AdminBannerManager';

import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ProductsProvider } from './context/ProductsContext';
import PageTransitionWrapper from './components/common/PageTransitionWrapper';
import ErrorBoundary from './components/common/ErrorBoundary';

import ProtectedRoute from './components/common/ProtectedRoute';

import BottomNav from './components/layout/BottomNav';
import WhatsAppOrderButton from './components/common/WhatsAppOrderButton';
import AccessibilityBanner from './components/common/AccessibilityBanner';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white">
      {/* ScrollToTop handled by PageTransitionWrapper */}

      <AccessibilityBanner />

      <PageTransitionWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/tracking-search" element={<OrderTrackingSearchPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          } />
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

          {/* Auth Flow Routes */}
          <Route path="/login" element={<AuthPage page="login" />} />
          <Route path="/signup" element={<AuthPage page="signup" />} />
          <Route path="/forgot-password" element={<AuthPage page="forgot" />} />
          <Route path="/email-sent" element={<AuthPage page="email-sent" />} />
          <Route path="/create-password" element={<AuthPage page="create-password" />} />
          <Route path="/reset-success" element={<AuthPage page="reset-success" />} />


          {/* Admin Routes */}
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
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </PageTransitionWrapper>

      {!isAdminPath && (
        <>
          <BottomNav />
          <WhatsAppOrderButton />
          <CartDrawer />
          <HomeFooter footerContent={cmsContent.footer} />
          <ChatWidget />
        </>
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
