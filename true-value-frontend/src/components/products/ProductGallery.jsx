import React, { useState } from 'react';
import { ZoomIn, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageWithFallback from '../common/ImageWithFallback';

const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    return (
        <div className="lg:col-span-7 space-y-4" data-aos="fade-right">
            <div
                className="relative aspect-square w-full bg-white rounded-xl overflow-hidden border border-gray-100 group shadow-sm cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            scale: isZoomed ? 1.5 : 1,
                            x: isZoomed ? '0%' : '0%', // Future: track mouse
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <ImageWithFallback
                            src={images[selectedImage]?.url}
                            alt="Main product"
                            className="w-full h-full object-contain origin-center transition-all duration-300"
                        />
                    </motion.div>
                </AnimatePresence>
                <button
                    className={`absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full p-2 text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity ${isZoomed ? 'text-primary ring-2 ring-primary' : ''}`}
                >
                    <ZoomIn size={20} />
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all overflow-hidden relative ${selectedImage === idx ? 'border-primary' : 'border-gray-200 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        {img.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle size={32} className="text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
