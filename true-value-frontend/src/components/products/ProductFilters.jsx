import React from 'react';
import { Tag, CircleDollarSign, Star, Clock, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useProducts } from '../../context/ProductsContext';

const ProductFilters = ({ filters, onFilterChange, onReset }) => {
    const { t } = useLanguage();
    const { categories, handleCategoryFilter, activeCategory, products } = useProducts();

    // Extract unique available brands from current products
    const availableBrands = [...new Set(products.map(p => p.brand || 'True Value'))].sort();

    const availableDelivery = [
        { key: 'Same Day', label: t('delivery', 'sameDay') },
        { key: 'Next Day', label: t('delivery', 'nextDay') },
        { key: '2-3 Days', label: t('delivery', 'days23') },
        { key: '3-5 Days', label: t('delivery', 'days35') }
    ];

    const toggleFilter = (key, value) => {
        const current = filters[key];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        onFilterChange(key, updated);
    };

    return (
        <div className="flex flex-col gap-8 bg-white p-6 lg:p-8 rounded-[32px] border border-gray-100 shadow-lg lg:h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-gray-900 text-lg font-black tracking-tight uppercase italic">{t('filters', 'title')}</h3>
                <button
                    onClick={onReset}
                    className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary-hover transition-colors cursor-pointer"
                >
                    {t('filters', 'reset')}
                </button>
            </div>

            <div className="flex flex-col gap-10 pb-6">
                {/* Dynamic Categories */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-[0.2em]">
                        <LayoutGrid size={14} className="text-primary" />
                        <span>Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-1">
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryFilter(cat._id)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat._id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brand Filter */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-[0.2em]">
                        <Tag size={14} className="text-primary" />
                        <span>{t('filters', 'brands')}</span>
                    </div>
                    <div className="space-y-3 pl-1">
                        {availableBrands.map((brand) => (
                            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center size-5">
                                    <input
                                        type="checkbox"
                                        checked={filters.brands.includes(brand)}
                                        onChange={() => toggleFilter('brands', brand)}
                                        className="peer appearance-none size-5 border-2 border-gray-200 rounded-lg checked:bg-primary checked:border-primary transition-all duration-300 cursor-pointer"
                                    />
                                    <svg className="absolute size-3 text-white pointer-events-none hidden peer-checked:block transition-all duration-300 transform scale-0 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className={`text-sm font-medium transition-colors duration-300 ${filters.brands.includes(brand) ? 'text-primary font-bold' : 'text-gray-500 group-hover:text-primary'}`}>{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-[0.2em]">
                        <CircleDollarSign size={14} className="text-primary" />
                        <span>{t('filters', 'price')}</span>
                    </div>
                    <div className="px-1">
                        <input
                            type="range"
                            value={filters.priceRange}
                            onChange={(e) => onFilterChange('priceRange', Number(e.target.value))}
                            className="w-full accent-primary bg-gray-100 h-2 rounded-full appearance-none cursor-pointer"
                            min="0"
                            max="10000"
                        />
                        <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
                            <span>₹0</span>
                            <span className="text-primary bg-primary/10 px-2 py-1 rounded-lg">₹{filters.priceRange === 10000 ? '10,000+' : filters.priceRange.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Time */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-[0.2em]">
                        <Clock size={14} className="text-primary" />
                        <span>{t('filters', 'deliveryTime')}</span>
                    </div>
                    <div className="space-y-3 pl-1">
                        {availableDelivery.map((time) => (
                            <label key={time.key} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center size-5">
                                    <input
                                        type="checkbox"
                                        checked={filters.deliveryTime.includes(time.key)}
                                        onChange={() => toggleFilter('deliveryTime', time.key)}
                                        className="peer appearance-none size-5 border-2 border-gray-200 rounded-lg checked:bg-primary checked:border-primary transition-all duration-300 cursor-pointer"
                                    />
                                    <svg className="absolute size-3 text-white pointer-events-none hidden peer-checked:block transition-all duration-300 transform scale-0 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className={`text-sm font-medium transition-colors duration-300 ${filters.deliveryTime.includes(time.key) ? 'text-primary font-bold' : 'text-gray-500 group-hover:text-primary'}`}>{time.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-[0.2em]">
                        <Star size={14} className="text-primary" />
                        <span>{t('filters', 'rating')}</span>
                    </div>
                    <div className="space-y-3 pl-1">
                        {[4, 3, 2].map((rating) => (
                            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={filters.rating === rating}
                                    onChange={() => onFilterChange('rating', rating)}
                                    className="appearance-none size-5 border-2 border-gray-200 rounded-full checked:border-primary checked:border-[6px] transition-all duration-300 cursor-pointer"
                                />
                                <div className={`flex items-center gap-1 transition-colors duration-300 ${filters.rating === rating ? 'text-primary' : 'text-gray-300 group-hover:text-primary'}`}>
                                    {[...Array(rating)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                                    <span className="text-[10px] ml-1 font-bold text-gray-400 uppercase tracking-wider">{t('filters', 'up')}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
