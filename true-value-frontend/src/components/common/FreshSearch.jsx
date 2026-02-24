import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, ScanLine, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const FreshSearch = ({ placeholder = "What can we get you today?", onSearch, defaultValue = "" }) => {
    const [query, setQuery] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useLanguage();
    const wrapperRef = useRef(null);

    // Debounced Search Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/search/autocomplete?q=${query}`);
                const data = await response.json();
                if (data.success) {
                    setSuggestions(data.hits);
                }
            } catch (error) {
                console.error('Autocomplete Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch?.(query);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (product) => {
        setQuery(product.name);
        setShowSuggestions(false);
        navigate(`/products/${product.objectID}`);
    };

    return (
        <div ref={wrapperRef} className="relative group w-full max-w-2xl mx-auto z-50">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Search size={22} strokeWidth={2.5} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={placeholder === "What can we get you today?" ? t('nav', 'placeholderLong') : placeholder}
                onKeyDown={handleKeyDown}
                className="w-full bg-white border border-transparent focus:border-primary/20 text-gray-900 text-base font-medium placeholder-gray-400 rounded-full py-4 pl-14 pr-24 shadow-premium hover:shadow-lg focus:shadow-xl outline-none transition-all duration-300"
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                {query && (
                    <button onClick={() => setQuery('')} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <X size={18} />
                    </button>
                )}
                <button
                    onClick={() => onSearch?.(query)}
                    className="p-2.5 text-gray-400 hover:text-primary hover:bg-secondary rounded-full transition-colors active:scale-90 cursor-pointer"
                >
                    <Search size={20} className="stroke-[2.5]" />
                </button>
                <div className="h-6 w-px bg-gray-100"></div>
                <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-secondary rounded-full transition-colors active:scale-90">
                    <Mic size={20} className="stroke-[2.5]" />
                </button>
            </div>

            {/* AUTOCOMPLETE DROPDOWN */}
            {showSuggestions && (query.length >= 2 || suggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="p-6 text-center text-gray-500 flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            {t('nav', 'finding')}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-2">
                            <div className="px-5 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp size={14} /> {t('nav', 'topResults')}
                            </div>
                            {suggestions.map((product) => (
                                <button
                                    key={product.objectID}
                                    onClick={() => handleSelectSuggestion(product)}
                                    className="w-full px-5 py-3 flex items-center gap-4 hover:bg-secondary/30 transition-colors text-left group/item"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                                        <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-semibold text-gray-900 group-hover/item:text-primary transition-colors">
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-gray-500">₹{product.price}</div>
                                    </div>
                                    <TrendingUp size={16} className="text-gray-200 group-hover/item:text-primary/40 transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        query.length >= 2 && <div className="p-6 text-center text-gray-500 italic">{t('nav', 'noMatches')}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FreshSearch;
