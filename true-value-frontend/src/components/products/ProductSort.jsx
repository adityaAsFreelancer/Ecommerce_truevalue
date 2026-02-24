import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ProductSort = ({ totalResults }) => {
    const { t } = useLanguage();
    const [activeSort, setActiveSort] = useState('RELEVANCE');

    const sortOptions = [
        { key: 'RELEVANCE', label: t('sort', 'relevance') },
        { key: 'PRICE: LOW-HIGH', label: t('sort', 'priceLowHigh') },
        { key: 'POPULARITY', label: t('sort', 'popularity') }
    ];

    return (
        <div className="bg-transparent" data-aos="fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-1.5 border border-gray-100 shadow-sm">
                    {sortOptions.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setActiveSort(option.key)}
                            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg transition-all duration-300 cursor-pointer ${activeSort === option.key
                                ? 'bg-white text-primary shadow-md shadow-primary/5 scale-100'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ProductSort;
