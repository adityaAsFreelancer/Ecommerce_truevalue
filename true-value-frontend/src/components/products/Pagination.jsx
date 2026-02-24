import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';

const Pagination = () => {
    const { pagination, changePage } = useProducts();
    const { page, pages } = pagination;

    if (pages <= 1) return null;

    const renderPageNumbers = () => {
        const numbers = [];
        const maxVisible = 5;
        let start = Math.max(1, page - 2);
        let end = Math.min(pages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            numbers.push(
                <button
                    key={i}
                    onClick={() => changePage(i)}
                    className={`h-10 w-10 rounded-lg font-bold transition-all cursor-pointer ${page === i
                        ? 'bg-primary text-white font-black'
                        : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }
        return numbers;
    };

    return (
        <div className="flex items-center justify-center py-12 gap-2 animate-in fade-in duration-700">
            <button
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200"
            >
                <ChevronLeft size={20} />
            </button>

            {page > 3 && (
                <>
                    <button onClick={() => changePage(1)} className="h-10 w-10 rounded-lg font-bold text-gray-600 hover:bg-gray-100">1</button>
                    <span className="px-1 text-gray-400">...</span>
                </>
            )}

            {renderPageNumbers()}

            {page < pages - 2 && (
                <>
                    <span className="px-1 text-gray-400">...</span>
                    <button onClick={() => changePage(pages)} className="h-10 w-10 rounded-lg font-bold text-gray-600 hover:bg-gray-100">{pages}</button>
                </>
            )}

            <button
                onClick={() => changePage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
