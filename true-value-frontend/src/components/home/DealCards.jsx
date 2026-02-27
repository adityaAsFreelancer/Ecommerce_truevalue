import React, { useRef } from 'react';
import { Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const deals = [
    { id: 1, name: 'Fresh Avocados', price: '₹4.99', oldPrice: '₹6.99', image: 'https://images.unsplash.com/photo-1523049673856-42868ac14b79?auto=format&fit=crop&q=80&w=300', rating: 4.8 },
    { id: 2, name: 'Organic Bananas', price: '₹2.49', oldPrice: '', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=300', rating: 4.9 },
    { id: 3, name: 'Red Apples', price: '₹3.99', oldPrice: '₹5.49', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300', rating: 4.7 },
    { id: 4, name: 'Fresh Broccoli', price: '₹1.99', oldPrice: '', image: 'https://images.unsplash.com/photo-1459411621453-7edd0c42711c?auto=format&fit=crop&q=80&w=300', rating: 4.6 },
    { id: 5, name: 'Sweet Oranges', price: '₹5.99', oldPrice: '₹7.99', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=300', rating: 4.9 },
];

const DealCards = () => {
    return (
        <section className="py-6 animate-fade-in-up">
            <div className="flex items-center justify-between px-6 mb-4">
                <h2 className="text-xl font-bold text-gray-900">Fresh Deals</h2>
                <button className="text-sm font-medium text-primary hover:text-primary-hover">View All</button>
            </div>

            <div className="overflow-x-auto pb-6 px-6 -mx-4 md:mx-0 snap-x scrollbar-hide">
                <div className="flex gap-4 w-max">
                    {deals.map((deal) => (
                        <div key={deal.id} className="w-[160px] md:w-[200px] bg-white rounded-3xl p-3 shadow-sm border border-gray-50 snap-start hover:shadow-premium transition-all duration-300 group cursor-pointer">
                            <div className="relative aspect-[4/3] mb-3 overflow-hidden rounded-2xl bg-gray-50">
                                <img
                                    src={deal.image}
                                    alt={deal.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {deal.oldPrice && (
                                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        SALE
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Link to={`/product/${deal.id}`} className="block text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5em]">
                                    {deal.name}
                                </Link>

                                <div className="flex items-center gap-1">
                                    <Star size={12} className="fill-primary text-primary" />
                                    <span className="text-xs text-gray-500 font-medium">{deal.rating}</span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-gray-900">{deal.price}</span>
                                        {deal.oldPrice && (
                                            <span className="text-[10px] text-gray-400 line-through decoration-red-400">{deal.oldPrice}</span>
                                        )}
                                    </div>
                                    <button className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover active:scale-95 transition-all shadow-sm group/btn">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealCards;
