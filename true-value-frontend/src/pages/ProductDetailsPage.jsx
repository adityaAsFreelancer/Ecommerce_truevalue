import React, { useState, useEffect } from 'react';
import HomeNavbar from '../components/home/HomeNavbar';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductGallery from '../components/products/ProductGallery';
import ProductDetailsInfo from '../components/products/ProductDetailsInfo';
import BuyBox from '../components/products/BuyBox';
import Specifications from '../components/products/Specifications';
import ReviewsSection from '../components/products/ReviewsSection';
import ProductCard from '../components/products/ProductCard';
import QuickViewModal from '../components/products/QuickViewModal';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { PageSpinner } from '../components/common/Loaders';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const { language, t } = useLanguage();
    const { wishlist, toggleWishlist } = useUser();
    const { getProductById, products } = useProducts();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const data = await getProductById(productId);
            setProduct(data);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
        };
        fetchDetails();
    }, [productId, getProductById]);

    if (loading) return (
        <div className="min-h-screen bg-white">
            <HomeNavbar />
            <PageSpinner message="Loading Product..." />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-6">
            <p className="font-black text-gray-400 uppercase tracking-[0.3em] text-[10px]">Product Not Found</p>
            <Link to="/products" className="px-8 py-4 bg-primary text-white rounded-xl font-black uppercase text-xs tracking-widest">Return to Fleet</Link>
        </div>
    );

    const displayName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
    const displayCategory = language === 'hi' && product.category_hi ? product.category_hi : (product.category?.name || product.category);
    const displayDesc = language === 'hi' && product.description_hi ? product.description_hi : product.description;

    const translatedProduct = {
        ...product,
        name: displayName,
        category: displayCategory,
        description: displayDesc,
    };

    const breadcrumbs = [
        { label: t('nav', 'home'), to: '/' },
        { label: displayCategory, to: '/products' },
        { label: product.brand || 'True Value', active: true }
    ];

    const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
    const finalRelated = relatedProducts.length > 0 ? relatedProducts : products.filter(p => p.id !== product.id).slice(0, 4);
    const isWishlisted = (id) => wishlist.some(item => item.id === id);

    return (
        <div className="min-h-screen bg-white font-display text-gray-900 selection:bg-primary/30">
            <HomeNavbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 mb-20">
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <Breadcrumbs items={breadcrumbs} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-12">
                    <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-6 duration-1000">
                        <ProductGallery images={product.images || [product.img]} />
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-10 animate-in fade-in slide-in-from-right-6 duration-1000">
                        <ProductDetailsInfo product={translatedProduct} />
                        <BuyBox
                            product={translatedProduct}
                            isWishlisted={isWishlisted(product.id)}
                            onToggleWishlist={() => toggleWishlist(product)}
                            inStock={product.stock > 0}
                        />

                        <div className="space-y-6 p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50">
                            <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-400 italic">{t('product', 'specHighlights')}</h3>
                            <ul className="space-y-4 text-sm font-bold text-gray-500 italic">
                                <li className="flex items-start gap-4">
                                    <div className="size-2 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-sm" />
                                    <span>{product.brand || 'True Value'} {language === 'hi' ? 'सत्यापित गुणवत्ता और प्रमाणिकता।' : 'Verified for premium quality and logistical integrity.'}</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="size-2 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-sm" />
                                    <span>{language === 'hi' ? `${displayCategory} में शीर्ष रेटेड विकल्प।` : `Engineered excellence in the ${displayCategory} category.`}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 border-t border-gray-50 pt-24">
                    {(product.ingredients || product.composition) && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000">
                            <h3 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tighter flex items-center gap-4 italic uppercase">
                                <span className="size-4 bg-primary rounded-full shadow-lg shadow-primary/20" />
                                {t('product', 'ingredients') || 'Composition'}
                            </h3>
                            <div className="bg-gray-50/30 p-10 rounded-[48px] border border-gray-100/50 leading-relaxed text-gray-500 font-bold text-lg italic whitespace-pre-line shadow-sm">
                                {product.ingredients || product.composition}
                            </div>
                        </div>
                    )}
                    {(product.usage || product.operations) && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-1000 delay-100">
                            <h3 className="font-black text-3xl md:text-4xl text-gray-900 tracking-tighter flex items-center gap-4 italic uppercase">
                                <span className="size-4 bg-primary rounded-full shadow-lg shadow-primary/20" />
                                {t('product', 'usage') || 'Operations'}
                            </h3>
                            <div className="bg-gray-50/30 p-10 rounded-[48px] border border-gray-100/50 leading-relaxed text-gray-500 font-bold text-lg italic whitespace-pre-line shadow-sm">
                                {product.usage || product.operations}
                            </div>
                        </div>
                    )}
                </div>

                <div className="animate-in fade-in duration-1000 delay-200">
                    <Specifications specs={product.specs} />
                </div>

                <div className="animate-in fade-in duration-1000 delay-300">
                    <ReviewsSection
                        rating={product.rating}
                        count={product.numReviews || product.reviews}
                        breakdowns={product.reviewBreakdown}
                    />
                </div>

                <section className="mt-32 pb-12 border-t border-gray-50 pt-24 animate-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <div className="flex items-center justify-between mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase">
                            {t('product', 'related')}
                        </h2>
                        <div className="h-px flex-1 bg-gray-50 mx-10 hidden md:block" />
                        <Link to="/products" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:underline">{t('product', 'exploreFleet')}</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {finalRelated.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                isWishlisted={isWishlisted(p.id)}
                                onToggleWishlist={() => toggleWishlist(p)}
                                onQuickView={setQuickViewProduct}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                isWishlisted={quickViewProduct && isWishlisted(quickViewProduct.id)}
                onToggleWishlist={toggleWishlist}
            />
        </div>
    );
};

export default ProductDetailsPage;
