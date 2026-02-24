import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import showAlert from '../../utils/swal';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onQuickView }) => {
    const navigate = useNavigate();
    const { cart, addToCart, updateQuantity } = useCart();
    const { language, t } = useLanguage();

    const mainImage = product.images && product.images[0]
        ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
        : product.img;
    const badgeText = product.inStock === false ? t('product', 'outOfStock') : (product.badge || product.tag);
    const productName = language === 'hi' && product.name_hi ? product.name_hi : product.name;
    const isOutOfStock = product.stock === 0 || product.inStock === false;

    const productId = product.id || product._id;
    const cartItem = cart.find(item => item.id === productId);
    const discountPercentage = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (isOutOfStock) return;
        addToCart(product, 1);
        showAlert({
            title: t('product', 'added'),
            text: `${productName}`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 hover:border-[#5EC401]/20 shadow-sm hover:shadow-xl hover:shadow-[#5EC401]/5 flex flex-col cursor-pointer relative transition-all duration-300 h-full w-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-white flex items-center justify-center">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    {badgeText && (
                        <div className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm ${isOutOfStock ? 'bg-gray-400 text-white' : 'bg-[#5EC401] text-white'}`}>
                            {badgeText}
                        </div>
                    )}
                    {discountPercentage > 0 && !isOutOfStock && (
                        <div className="text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider bg-primary text-white shadow-sm">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>

                {/* Main Product Image */}
                <ImageWithFallback
                    src={mainImage}
                    alt={productName}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                />

                {/* Quick Actions (Hover Only) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 pointer-events-auto">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(); }}
                        className={`size-9 flex items-center justify-center bg-white rounded-xl shadow-md transition-colors ${isWishlisted ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                    >
                        <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
                        className="size-9 flex items-center justify-center bg-white rounded-xl shadow-md text-gray-400 hover:text-[#5EC401] transition-colors"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Floating button removed for better accessibility (no hover needed) */}
            </div>

            {/* Content Section */}
            <div className="p-4 pt-1 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{product.brand || 'Organic'}</span>
                    <div className="flex items-center gap-0.5">
                        <Star size={10} className="text-primary fill-primary" />
                        <span className="text-[10px] font-black text-gray-700">{product.rating}</span>
                    </div>
                </div>

                <h3 className="text-gray-800 font-bold text-sm line-clamp-2 leading-tight h-[38px] group-hover:text-[#5EC401] transition-colors">
                    {productName}
                </h3>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50/50">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-gray-900 leading-none tracking-tighter">{t('common', 'currency')}{(product?.price || 0).toFixed(0)}</span>
                        {product?.oldPrice && (
                            <span className="text-[10px] text-gray-400 line-through font-medium leading-none mt-0.5">{t('common', 'currency')}{(product.oldPrice || 0).toFixed(0)}</span>
                        )}
                    </div>

                    {cartItem ? (
                        <div className="flex items-center bg-gray-100 rounded-2xl h-10 px-2 border-2 border-primary/10">
                            <button
                                onClick={(e) => { e.stopPropagation(); updateQuantity(productId, Math.max(0, parseInt(cartItem.quantity) - 1)); }}
                                className="size-8 flex items-center justify-center text-gray-500 hover:text-primary font-black text-lg"
                            >
                                -
                            </button>
                            <span className="w-8 text-center text-sm font-black text-gray-900">{cartItem.quantity}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); updateQuantity(productId, parseInt(cartItem.quantity) + 1); }}
                                className="size-8 flex items-center justify-center text-gray-500 hover:text-primary font-black text-lg"
                            >
                                +
                            </button>
                        </div>
                    ) : !isOutOfStock && (
                        <button
                            onClick={handleAddToCart}
                            className="h-10 px-4 bg-primary text-white rounded-2xl font-black text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-tight"
                        >
                            <ShoppingCart size={14} className="stroke-[3px]" />
                            {language === 'hi' ? 'जोड़ें' : 'Add'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
