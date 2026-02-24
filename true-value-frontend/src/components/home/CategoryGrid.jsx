import React, { useRef } from 'react';
import {
    Carrot, Apple, Drumstick, Fish, Milk,
    Flame, Coffee, Cookie, ChevronLeft, ChevronRight,
    Snowflake, Croissant, Droplets, Heart, Baby, PenTool,
    PawPrint, Dumbbell, Pill, Shirt, Smartphone, Home, Wrench, Sparkles
} from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const categories = [
    { id: 1, name: 'Vegetables', tKey: 'vegetables', icon: Carrot, color: 'bg-green-50 text-green-600' },
    { id: 2, name: 'Fruits', tKey: 'fruits', icon: Apple, color: 'bg-red-50 text-red-500' },
    { id: 3, name: 'Meat & Poultry', tKey: 'meat', icon: Drumstick, color: 'bg-rose-50 text-rose-600' },
    { id: 4, name: 'Seafood', tKey: 'seafood', icon: Fish, color: 'bg-cyan-50 text-cyan-600' },
    { id: 5, name: 'Dairy', tKey: 'dairy', icon: Milk, color: 'bg-blue-50 text-blue-500' },
    { id: 6, name: 'Cooking Essentials', tKey: 'cooking', icon: Flame, color: 'bg-orange-50 text-orange-500' },
    { id: 7, name: 'Beverages', tKey: 'beverages', icon: Coffee, color: 'bg-amber-50 text-amber-600' },
    { id: 8, name: 'Snacks', tKey: 'snacks', icon: Cookie, color: 'bg-yellow-50 text-yellow-600' },
    { id: 9, name: 'Frozen Foods', tKey: 'frozen', icon: Snowflake, color: 'bg-sky-50 text-sky-500' },
    { id: 10, name: 'Bakery', tKey: 'bakery', icon: Croissant, color: 'bg-amber-50 text-amber-700' },
    { id: 11, name: 'Water', tKey: 'water', icon: Droplets, color: 'bg-blue-50 text-blue-400' },
    { id: 12, name: "Women's Care", tKey: 'women', icon: Heart, color: 'bg-pink-50 text-pink-500' },
    { id: 13, name: 'Baby Products', tKey: 'baby', icon: Baby, color: 'bg-purple-50 text-purple-400' },
    { id: 14, name: 'Personal Care', tKey: 'personal', icon: Sparkles, color: 'bg-pink-50 text-pink-600' },
    { id: 15, name: 'Pharmacy', tKey: 'pharmacy', icon: Pill, color: 'bg-teal-50 text-teal-600' },
    { id: 16, name: 'Clothing', tKey: 'clothing', icon: Shirt, color: 'bg-indigo-50 text-indigo-500' },
    { id: 17, name: 'Electronics', tKey: 'electronics', icon: Smartphone, color: 'bg-purple-50 text-purple-500' },
    { id: 18, name: 'Home & Kitchen', tKey: 'home', icon: Home, color: 'bg-slate-50 text-slate-600' },
    { id: 19, name: 'Tools & Hardware', tKey: 'tools', icon: Wrench, color: 'bg-gray-100 text-gray-700' },
    { id: 20, name: 'Stationery', tKey: 'stationary', icon: PenTool, color: 'bg-blue-50 text-blue-600' },
    { id: 21, name: 'Pet Supplies', tKey: 'pet', icon: PawPrint, color: 'bg-orange-50 text-orange-600' },
    { id: 22, name: 'Sports', tKey: 'sports', icon: Dumbbell, color: 'bg-green-50 text-green-500' },
];

const CategoryGrid = () => {
    const scrollRef = useRef(null);
    const { categories: backendCategories, handleCategoryFilter } = useProducts();
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Only show categories that exist in the backend OR show all if backend is charging
    const displayCategories = React.useMemo(() => {
        if (!backendCategories || backendCategories.length === 0) return categories;

        const backendNames = backendCategories.map(c => c.name);
        return categories.filter(c => backendNames.includes(c.name));
    }, [backendCategories]);

    const handleCategoryClick = (categoryName) => {
        handleCategoryFilter(categoryName);
        navigate('/products');
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-8 px-4 bg-[#F8FDF5]">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl lg:text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{t('categories', 'explore')}</h2>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">{t('categories', 'quickAccess')}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-1">
                        <button onClick={() => scroll('left')} className="size-8 rounded-lg bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={() => scroll('right')} className="size-8 rounded-lg bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-all">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-smooth">
                    {displayCategories.map((cat) => (
                        <div
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.name)}
                            className="flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-[32px] cursor-pointer transition-all duration-300 bg-white border border-gray-100/50 hover:border-[#5EC401]/20 hover:shadow-premium group min-w-[110px] shadow-sm"
                        >
                            <div className={`p-3.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <cat.icon size={24} className="stroke-[2.5]" />
                            </div>
                            <span className="text-[10px] font-black text-gray-800 text-center leading-tight uppercase tracking-wider group-hover:text-[#5EC401] transition-colors">
                                {t('nav', cat.tKey) || cat.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
