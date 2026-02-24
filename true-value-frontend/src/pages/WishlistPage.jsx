import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import ProductCard from '../components/products/ProductCard';
import QuickViewModal from '../components/products/QuickViewModal';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { wishlist, toggleWishlist } = useUser();
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // Deep scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Wishlist contains full product objects in Context
    const wishlistedProducts = wishlist;

    return (
        <div className="min-h-screen bg-gray-50/50 font-display text-gray-900 selection:bg-primary/20">
            <HomeNavbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-primary/10 text-primary rounded-[20px] shadow-sm">
                                <Heart size={32} className="fill-current" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-gray-900">
                                Your Wishlist
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg font-medium max-w-2xl leading-relaxed">
                            A curated selection of items you're keeping an eye on. Fast checkout ready.
                        </p>
                    </div>
                    {wishlistedProducts.length > 0 && (
                        <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-premium text-gray-400 font-bold text-xs tracking-widest uppercase">
                            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'Item' : 'Items'} Saved
                        </div>
                    )}
                </div>

                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlistedProducts.filter(p => p && p.id).map((product, idx) => (
                            <div
                                key={product.id || idx}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <ProductCard
                                    product={product}
                                    isWishlisted={true}
                                    onToggleWishlist={() => toggleWishlist(product)}
                                    onQuickView={setQuickViewProduct}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[48px] border border-gray-100 shadow-premium p-10 max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
                        <div className="size-32 bg-gray-50 rounded-full flex items-center justify-center mb-10 shadow-xl shadow-gray-200 ring-8 ring-gray-50/50">
                            <Heart size={64} className="text-gray-300 fill-gray-300/10" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your wishlist is lonely</h2>
                        <p className="text-gray-400 text-lg font-medium max-w-md mb-12 leading-relaxed">
                            Items you save will appear here. Start exploring our premium collection and fill it with love.
                        </p>
                        <Link
                            to="/products"
                            className="bg-gray-900 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-gray-900/10 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 group uppercase tracking-widest text-[11px] cursor-pointer"
                        >
                            <ShoppingBag size={20} />
                            Browse Catalog
                            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                    </div>
                )}
            </main>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                isWishlisted={quickViewProduct && wishlist.some(w => w.id === quickViewProduct.id)}
                onToggleWishlist={toggleWishlist}
            />
        </div>
    );
};

export default WishlistPage;
