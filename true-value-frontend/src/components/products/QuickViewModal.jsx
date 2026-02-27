import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Heart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import showAlert from '../../utils/swal';

const QuickViewModal = ({ product, isOpen, onClose, isWishlisted, onToggleWishlist }) => {
    const { language, t } = useLanguage();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // Reset state when product changes
    React.useEffect(() => {
        if (isOpen && product) {
            setSelectedImage(0);
            setQuantity(1);
        }
    }, [isOpen, product]);

    // Safe values if product is missing
    const mainImage = product?.images ? product.images[selectedImage]?.url : product?.img;
    const images = product?.images || (product?.img ? [{ url: product.img }] : []);
    const productName = language === 'hi' && product?.name_hi ? product.name_hi : product?.name;
    const isOutOfStock = product?.inStock === false;

    const handleAddToCart = () => {
        if (!product || isOutOfStock) return;
        addToCart(product, quantity);
        showAlert({
            title: 'Added to Cart!',
            text: `${productName} (${quantity}x) has been added to your cart.`,
            icon: 'success'
        });
        onClose();
    };

    const handleBuyNow = () => {
        if (!product || isOutOfStock) return;
        addToCart(product, quantity);
        navigate('/checkout');
        onClose();
    };

    return (
        <AnimatePresence>
            {(isOpen && product) && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/60 z-[9999] backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[10000] m-auto w-full max-w-4xl h-fit max-h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white shadow-sm transition-colors text-gray-900"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 bg-gray-50">
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center relative">
                                <img
                                    src={mainImage}
                                    alt={productName}
                                    className="w-full h-full object-contain p-4"
                                />
                                {product.badge && (
                                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-primary/20">
                                        {product.badge}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`size-16 rounded-xl border-2 flex-shrink-0 overflow-hidden bg-white shadow-sm transition-all ${selectedImage === idx ? 'border-primary ring-2 ring-primary/10' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</div>
                                {isOutOfStock && (
                                    <span className="text-gray-500 font-bold text-[10px] uppercase bg-gray-100 px-2 py-1 rounded-lg tracking-wider">Out of Stock</span>
                                )}
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3">
                                {productName}
                            </h2>

                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-200" : ""} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-gray-400">({product.reviews} reviews)</span>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 font-medium">
                                {product.description || "Experience premium quality with this top-rated product from TrueValue. Designed for durability and performance, it's the perfect addition to your collection."}
                            </p>

                            <div className="space-y-6 mt-auto">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-black text-gray-900">{t('common', 'currency')}{product.price.toFixed(2)}</span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through font-medium">{t('common', 'currency')}{product.oldPrice.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="size-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 text-gray-600 font-bold"
                                            disabled={isOutOfStock}
                                        >
                                            -
                                        </button>
                                        <span className="w-5 text-center font-black text-gray-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="size-8 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 text-gray-600 font-bold"
                                            disabled={isOutOfStock}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white transition-all active:scale-[0.98] ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black shadow-lg shadow-gray-900/20'}`}
                                    >
                                        <ShoppingCart size={18} />
                                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                    {!isOutOfStock && (
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-white bg-primary transition-all active:scale-[0.98] hover:bg-primary-hover shadow-lg shadow-primary/20"
                                        >
                                            Buy Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onToggleWishlist?.(product.id)}
                                        className={`size-14 flex-shrink-0 flex items-center justify-center rounded-xl border-2 transition-all active:scale-95 ${isWishlisted ? 'border-primary text-primary bg-primary/10' : 'border-gray-100 text-gray-400 hover:border-primary hover:text-primary hover:bg-white bg-gray-50'}`}
                                    >
                                        <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
