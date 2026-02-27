import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';
import HomeNavbar from '../components/home/HomeNavbar';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductFilters from '../components/products/ProductFilters';
import ProductSort from '../components/products/ProductSort';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/products/Pagination';
import QuickViewModal from '../components/products/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useProducts } from '../context/ProductsContext';
import { CardSkeleton } from '../components/common/Loaders';

const ProductListingPage = () => {
    const {
        products,
        loading,
        searchQuery,
        activeCategory,
        handleSearch,
        resetFilters: resetContextFilters,
        refreshProducts: fetchProducts
    } = useProducts();

    const { t } = useLanguage();
    const { wishlist, toggleWishlist } = useUser();
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Deep scroll to top on mount or when contextual products change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [products.length, searchQuery, activeCategory]);

    // Local filter UI state
    const [filters, setFilters] = useState({
        brands: [],
        priceRange: 10000,
        rating: null,
        features: [],
        cuisine: [],
        dietary: [],
        deliveryTime: []
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Refetch products when filters (brands, rating, priceRange) change
    useEffect(() => {
        const fetchParams = {
            brands: filters.brands,
            rating: filters.rating,
            priceRange: filters.priceRange
        };
        fetchProducts(fetchParams);
    }, [filters.brands, filters.rating, filters.priceRange, fetchProducts]);

    const resetFilters = () => {
        setFilters({
            brands: [],
            priceRange: 10000,
            rating: null,
            features: [],
            cuisine: [],
            dietary: [],
            deliveryTime: []
        });
        resetContextFilters();
    };

    const breadcrumbItems = [
        { label: t('nav', 'home'), to: '/' },
        { label: activeCategory || t('listing', 'allProducts'), active: true }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white selection:bg-primary/20">
            <HomeNavbar />

            <main className="flex-1 max-w-[1440px] mx-auto px-4 md:px-8 py-12 w-full">
                <div className="mb-8">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden w-full py-4 bg-gray-50 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-900 border border-gray-100 flex items-center justify-center gap-2 mb-6"
                    >
                        <Box size={16} />
                        Filter Products
                    </button>

                    {/* Filters Sidebar */}
                    <aside className={`
                        fixed inset-0 z-50 bg-white p-6 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 lg:p-0 lg:bg-transparent lg:w-[300px] lg:block lg:overflow-visible
                        ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <div className="lg:sticky lg:top-28 space-y-6">
                            <div className="flex items-center justify-between lg:hidden mb-6">
                                <h3 className="text-xl font-black text-gray-900 uppercase italic">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full">
                                    <Box size={20} className="rotate-45" />
                                </button>
                            </div>

                            <ProductFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onReset={resetFilters}
                                products={products}
                            />

                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-xl lg:hidden mt-6"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                            <div className="space-y-2">
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase italic">
                                    {searchQuery ? (
                                        <>{t('listing', 'searchLabel')} <span className="text-primary">"{searchQuery}"</span></>
                                    ) : (
                                        activeCategory || t('listing', 'allProducts')
                                    )}
                                </h1>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    {products?.length || 0} {t('common', 'premiumQuality')} {(products?.length || 0) === 1 ? t('listing', 'found') : t('listing', 'foundLabel')}
                                </p>
                            </div>
                            <ProductSort totalResults={products?.length || 0} />
                        </div>

                        {loading ? (
                            <CardSkeleton count={6} />
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        isWishlisted={wishlist.some(item => item.id === product.id)}
                                        onToggleWishlist={toggleWishlist}
                                        onQuickView={setQuickViewProduct}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                                <div className="bg-white p-10 rounded-full mb-8 shadow-premium border border-gray-100">
                                    <Box size={56} className="text-primary/30" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase italic tracking-tighter">{t('listing', 'noProducts')}</h3>
                                <p className="text-gray-400 max-w-sm font-bold mb-10 text-sm leading-relaxed italic">{t('listing', 'noMatch')}</p>
                                <button
                                    onClick={resetFilters}
                                    className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl shadow-gray-900/20 transition-all active:scale-95 cursor-pointer"
                                >
                                    {t('listing', 'clearFilters')}
                                </button>
                            </div>
                        )}

                        {!loading && products.length > 0 && (
                            <div className="mt-20 border-t border-gray-100 pt-12">
                                <Pagination />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                isWishlisted={quickViewProduct && wishlist.some(item => item.id === quickViewProduct.id)}
                onToggleWishlist={toggleWishlist}
            />
        </div>
    );
};

export default ProductListingPage;
