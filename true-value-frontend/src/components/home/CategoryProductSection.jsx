import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import QuickViewModal from '../products/QuickViewModal';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductsContext';
import { useLanguage } from '../../context/LanguageContext';

const CategoryProductSection = ({
    category,
    categoryIcon,
    products,
    bgColor = 'bg-white'
}) => {
    const scrollRef = useRef(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const { wishlist, toggleWishlist } = useUser();
    const { handleCategoryFilter } = useProducts();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Map display category names to translation keys
    const categoryKeyMap = {
        'Vegetables': 'vegetables',
        'Fruits': 'fruits',
        'Meat & Poultry': 'meat',
        'Seafood': 'seafood',
        'Dairy': 'dairy',
        'Cooking Essentials': 'cooking',
        'Beverages': 'beverages',
        'Snacks': 'snacks',
        'Frozen Foods': 'frozen',
        'Bakery': 'bakery',
        'Water': 'water',
        "Women's Care": 'women',
        'Baby Products': 'baby',
        'Personal Care': 'personal',
        'Pharmacy': 'pharmacy',
        'Clothing': 'clothing',
        'Electronics': 'electronics',
        'Home & Kitchen': 'home',
        'Tools & Hardware': 'tools',
        'Stationery': 'stationary',
        'Pet Supplies': 'pet',
        'Sports': 'sports'
    };

    const tKey = categoryKeyMap[category] || category.toLowerCase();

    const isWishlisted = (id) => wishlist.some(item => item.id === id);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleSeeAll = () => {
        handleCategoryFilter(category);
        navigate('/products');
    };

    if (!products || products.length === 0) return null;

    return (
        <section className={`py-4 ${bgColor} transition-colors`}>
            <div className="mx-auto max-w-[1440px] px-4 md:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-2">
                    <div className="flex items-center gap-3">
                        {categoryIcon && (
                            <div className="size-11 rounded-2xl bg-[#5EC401]/10 flex items-center justify-center text-[#5EC401]">
                                {React.cloneElement(categoryIcon, { size: 24 })}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                                {t('nav', tKey) || category}
                            </h2>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t('common', 'premiumQuality')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex items-center gap-1.5 mr-2">
                            <button onClick={() => scroll('left')} className="size-8 rounded-lg bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-all"><ChevronLeft size={16} /></button>
                            <button onClick={() => scroll('right')} className="size-8 rounded-lg bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-all"><ChevronRight size={16} /></button>
                        </div>
                        <button
                            onClick={handleSeeAll}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 hover:bg-[#5EC401] text-gray-600 hover:text-white text-[11px] font-black uppercase tracking-wider transition-all"
                        >
                            <span>{t('common', 'seeAll')}</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Products Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                >
                    {products.slice(0, 8).map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[200px] md:w-[240px]"
                        >
                            <ProductCard
                                product={product}
                                isWishlisted={isWishlisted(product.id)}
                                onToggleWishlist={() => toggleWishlist(product)}
                                onQuickView={setQuickViewProduct}
                            />
                        </div>
                    ))}
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

export default CategoryProductSection;
