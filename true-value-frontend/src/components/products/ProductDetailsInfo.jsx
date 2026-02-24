import React from 'react';
import { Star, Verified } from 'lucide-react';

const ProductDetailsInfo = ({ product }) => {
    return (
        <div className="space-y-6" data-aos="fade-left">
            <div>
                <span className="text-xs font-black tracking-widest text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                    {product.badge || 'Best Seller'}
                </span>
                <h1 className="text-3xl lg:text-4xl font-black mt-4 leading-tight text-gray-900 font-display">
                    {product.name}
                </h1>
                <p className="text-gray-500 mt-2 text-sm font-medium">Model: {product.model} | SKU: {product.sku}</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={20}
                            className={`${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-gray-200'}`}
                        />
                    ))}
                </div>
                <span className="text-sm font-bold underline cursor-pointer hover:text-primary transition-colors text-gray-700">
                    {product.rating} ({product.reviews} Reviews)
                </span>
                <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <Verified size={18} />
                    Verified Dealer
                </span>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-gray-900 font-display">${product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                        <span className="text-xl text-gray-400 line-through font-medium">${product.oldPrice.toFixed(2)}</span>
                    )}
                    {product.oldPrice && (
                        <span className="bg-green-100 text-green-700 font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Save ${(product.oldPrice - product.price).toFixed(2)}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-primary font-bold">
                    <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                    <span>In Stock & Ready to Ship</span>
                </div>

                <p className="text-gray-600 leading-relaxed text-lg font-medium">
                    {product.description}
                </p>

                <p className="text-sm text-gray-500 font-medium">
                    Order within <span className="font-bold text-gray-900">4 hours 20 mins</span> for same-day dispatch.
                </p>
            </div>
        </div>
    );
};

export default ProductDetailsInfo;
