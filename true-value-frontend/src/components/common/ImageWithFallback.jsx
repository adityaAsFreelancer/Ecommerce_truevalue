
import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

const ImageWithFallback = ({
    src,
    alt,
    className = "",
    fallbackSrc = null,
    onLoad
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
        setCurrentSrc(src);
    }, [src]);

    const handleLoad = (e) => {
        setIsLoading(false);
        if (onLoad) onLoad(e);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
            )}

            {hasError ? (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-gray-300">
                    <ImageOff className="w-1/3 h-1/3 mb-2 opacity-50" />
                    <span className="text-[10px] font-medium uppercase tracking-widest opacity-60">No Image</span>
                </div>
            ) : (
                <img
                    src={currentSrc}
                    alt={alt}
                    className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    );
};

export default ImageWithFallback;
