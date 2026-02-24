import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Truck, RotateCcw, ShieldCheck, Lock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import showAlert from '../../utils/swal';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';

const BuyBox = ({ product, isWishlisted, onToggleWishlist, inStock = true }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { isAuthenticated } = useUser();

    // Safety check for undefined inStock, default to true if missing
    const isOutOfStock = inStock === false;
    const productName = language === 'hi' && product.name_hi ? product.name_hi : product.name;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        showAlert({
            title: language === 'hi' ? 'कार्ट में जोड़ा गया!' : 'Added to Cart!',
            text: language === 'hi'
                ? `${productName} (${quantity}x) आपकी कार्ट में जोड़ दिया गया है।`
                : `${productName} (${quantity}x) has been added to your shopping cart.`,
            icon: 'success'
        });
    };

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        addToCart(product, quantity);
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-premium relative overflow-hidden" data-aos="fade-up">
            {isOutOfStock && (
                <div className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-black uppercase px-3 py-1 rounded-bl-xl z-20">
                    Out of Stock
                </div>
            )}
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <label className="text-sm font-black uppercase tracking-wider text-gray-400">Quantity:</label>
                        <div className={`flex items-center border border-gray-200 rounded-xl overflow-hidden h-12 bg-white ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 hover:bg-gray-50 transition-colors text-gray-500"
                            >
                                <Minus size={16} />
                            </button>
                            <input
                                readOnly
                                className="w-12 text-center border-none focus:ring-0 bg-transparent text-sm font-black text-gray-900"
                                type="number"
                                value={quantity}
                            />
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 hover:bg-gray-50 transition-colors text-gray-500"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onToggleWishlist}
                        className={`size-12 rounded-xl flex items-center justify-center border transition-all ${isWishlisted
                            ? 'border-gray-200 bg-gray-50 text-gray-500'
                            : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900'
                            }`}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <motion.button
                        whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                        whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`w-full font-black py-5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg ${isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-primary hover:bg-primary-hover text-white shadow-primary/20'
                            }`}
                    >
                        <ShoppingCart size={22} />
                        {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </motion.button>
                    {!isOutOfStock && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuyNow}
                            className="w-full bg-gray-900 text-white font-black py-5 rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-900/20"
                        >
                            BUY IT NOW
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <Truck size={16} className="text-primary" />
                    <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                    <RotateCcw size={16} className="text-primary" />
                    <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock size={16} className="text-primary" />
                    <span>Secure Payment</span>
                </div>
            </div>
        </div>
    );
};

export default BuyBox;
