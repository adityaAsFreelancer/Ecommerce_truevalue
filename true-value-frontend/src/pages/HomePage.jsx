import React, { useEffect, useMemo } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import HomeHero from '../components/home/HomeHero';
import OffersCarousel from '../components/home/OffersCarousel';
import FlashSalesSection from '../components/home/FlashSalesSection';
import CategoryGrid from '../components/home/CategoryGrid';
import CategoryProductSection from '../components/home/CategoryProductSection';
import { cmsContent } from '../data/siteData';
import { useProducts } from '../context/ProductsContext';
import {
    Carrot, Apple, Drumstick, Milk,
    Flame, Coffee, Cookie, Shirt, Smartphone,
    Sparkles, Heart, Baby
} from 'lucide-react';

// Category icons mapping
const categoryIcons = {
    'Vegetables': <Carrot size={22} />,
    'Fruits': <Apple size={22} />,
    'Meat & Poultry': <Drumstick size={22} />,
    'Dairy': <Milk size={22} />,
    'Cooking Essentials': <Flame size={22} />,
    'Beverages': <Coffee size={22} />,
    'Snacks': <Cookie size={22} />,
    "Women's Care": <Heart size={22} />,
    'Baby Products': <Baby size={22} />,
    'Personal Care': <Sparkles size={22} />,
    'Clothing': <Shirt size={22} />,
    'Electronics': <Smartphone size={22} />,
};

// Featured categories for homepage
const homeCategories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Cooking Essentials',
    'Snacks',
    "Women's Care",
    'Electronics',
    'Clothing',
];

const HomePage = () => {
    const { products: backendProducts, categories: backendCategories, loading } = useProducts();

    // Group products by category - Max 6 products for efficiency
    const productsByCategory = useMemo(() => {
        const grouped = {};
        if (!backendProducts || backendProducts.length === 0) return grouped;

        // Use backend categories to decide which ones to show on homepage
        const categoriesToShow = backendCategories.length > 0
            ? backendCategories.map(c => c.name).slice(0, 8)
            : homeCategories;

        backendProducts.forEach(p => {
            if (categoriesToShow.includes(p.category)) {
                if (!grouped[p.category]) grouped[p.category] = [];
                if (grouped[p.category].length < 6) {
                    grouped[p.category].push(p);
                }
            }
        });
        return grouped;
    }, [backendProducts, backendCategories]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FDF5] font-display pb-20 selection:bg-[#5EC401]/30">
            <HomeNavbar />
            <main className="flex-1 w-full max-w-[1440px] mx-auto">
                <HomeHero content={cmsContent.hero} />
                <OffersCarousel />
                <FlashSalesSection products={backendProducts.filter(p => p.salePrice || (p.price < 500))} />
                <CategoryGrid />

                <div className="space-y-4">
                    {homeCategories.map((category, index) => {
                        const products = productsByCategory[category];
                        if (!products || products.length === 0) return null;
                        return (
                            <CategoryProductSection
                                key={category}
                                category={category}
                                categoryIcon={categoryIcons[category]}
                                products={products}
                                bgColor={index % 2 === 0 ? 'bg-white/50' : 'bg-transparent'}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
