import React from 'react';
import { Star, CheckCircle, ThumbsUp, Flag } from 'lucide-react';

const ReviewsSection = ({ rating, count, breakdowns = [65, 20, 10, 3, 2] }) => {
    return (
        <section className="mt-20" data-aos="fade-up">
            <h2 className="text-3xl font-black mb-10 text-gray-900 font-display tracking-tight">Customer Reviews</h2>
            <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-premium">
                <div className="flex flex-wrap gap-x-20 gap-y-12">
                    {/* Rating Summary */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <p className="text-6xl font-black tracking-tight text-gray-900 font-display">{rating}</p>
                            <div className="flex gap-1 text-primary mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={24} className={`${i < Math.floor(rating) ? 'fill-amber-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-3 font-bold uppercase tracking-wider">Based on {count} reviews</p>
                        </div>
                        <button className="bg-gray-900 text-white font-black py-3 px-8 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20">
                            Write a Review
                        </button>
                    </div>

                    <div className="grid min-w-[280px] max-w-[500px] flex-1 grid-cols-[30px_1fr_45px] items-center gap-y-4">
                        {breakdowns.map((b, idx) => (
                            <React.Fragment key={idx}>
                                <p className="text-sm font-black text-gray-900">{5 - idx}</p>
                                <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-gray-100 ml-4 mr-4">
                                    <div className="rounded-full bg-primary" style={{ width: `${b}%` }}></div>
                                </div>
                                <p className="text-sm font-bold text-gray-400 text-right">{b}%</p>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="mt-16 space-y-12">
                    {/* Sample Review */}
                    <div className="border-t border-gray-100 pt-10 group">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex gap-1 text-primary mb-3">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-amber-400" />)}
                                </div>
                                <h4 className="font-black text-xl text-gray-900 font-display">Incredible Power for the Size</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="font-bold text-sm text-gray-900">Mike R.</span>
                                    <span className="h-3 w-px bg-gray-300"></span>
                                    <span className="text-xs text-primary font-black flex items-center gap-1.5 uppercase tracking-widest">
                                        <CheckCircle size={14} />
                                        Verified Purchase
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Oct 12, 2023</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed max-w-3xl font-medium">
                            I've used a lot of drills over the years, but this brushless motor is a game changer. The battery life is significantly better than my previous 18V model. Compact enough to fit in tight spaces between studs but still has the torque to drive 3-inch screws without hesitation.
                        </p>
                        <div className="mt-6 flex items-center gap-6">
                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">
                                <ThumbsUp size={16} /> Helpful (24)
                            </button>
                            <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                                <Flag size={16} /> Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
