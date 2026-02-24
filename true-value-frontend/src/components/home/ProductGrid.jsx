import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import QuickViewModal from '../products/QuickViewModal';
import { products as masterProducts } from '../../data/products';
import { useUser } from '../../context/UserContext';

const ProductGrid = ({ onSeeMore, onNavigateToDetails }) => {
    const products = masterProducts.slice(0, 4);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const { wishlist, toggleWishlist } = useUser();

    const isWishlisted = (id) => wishlist.some(item => item.id === id);

    return (
        <section className="bg-white py-24 lg:py-32">
            <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="inline-block rounded-full bg-primary/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                Curated
                            </span>
                            <div className="h-px w-12 bg-primary/20" />
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">Recommended <span className="text-primary italic">for You</span></h2>
                        <p className="text-gray-500 font-medium max-w-xl">Explore our top picks tailored to your project needs and preferences.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="size-14 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center group">
                            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button className="size-14 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-primary hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center group">
                            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {products.map((p, index) => {
                        return (
                            <ProductCard
                                key={p.id}
                                index={index}
                                product={p}
                                onNavigateToDetails={onNavigateToDetails}
                                isWishlisted={isWishlisted(p.id)}
                                onToggleWishlist={() => toggleWishlist(p)}
                                onQuickView={setQuickViewProduct}
                            />
                        );
                    })}
                </div>

                <div className="mt-20 text-center">
                    <button
                        onClick={onSeeMore}
                        className="px-12 py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-primary transition-all duration-300 shadow-xl shadow-gray-900/10 hover:shadow-primary/20 active:scale-95"
                    >
                        Explore Full Catalog
                    </button>
                </div>
            </div>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                isWishlisted={quickViewProduct && isWishlisted(quickViewProduct.id)}
                onToggleWishlist={toggleWishlist}
            />
        </section>

    );
};

export default ProductGrid;
