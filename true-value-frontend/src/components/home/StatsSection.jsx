import React, { useRef, useEffect } from 'react';
import { Brain, ShoppingBag, Verified } from 'lucide-react';
import gsap from 'gsap';

const StatsSection = ({ items }) => {
    const sectionRef = useRef(null);

    // Map icon strings to components
    const iconMap = {
        'Brain': <Brain size={32} />,
        'ShoppingBag': <ShoppingBag size={32} />,
        'Verified': <Verified size={32} />
    };

    useEffect(() => {
        if (!items || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.stat-card',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%"
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [items]);

    if (!items) return null;

    return (
        <section ref={sectionRef} className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 lg:py-24">
            <div className="grid md:grid-cols-3 gap-10">
                {items.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card flex items-center gap-8 p-10 rounded-[32px] bg-white border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-500 group cursor-default opacity-0"
                    >
                        <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/10">
                            {React.cloneElement(iconMap[stat.iconType] || <Verified />, { size: 32, className: "transition-transform group-hover:scale-110" })}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{stat.label}</p>
                            <p className="text-xl font-black text-gray-900 leading-tight">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
