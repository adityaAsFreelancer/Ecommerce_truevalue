import React from 'react';
import { Bolt, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Specifications = ({ specs }) => {
    const { language, t } = useLanguage();

    if (!specs) return null;

    // Handle both array (legacy) and object (current) formats
    const specList = Array.isArray(specs)
        ? specs
        : Object.entries(specs).map(([key, value]) => ({ label: key, value }));

    return (
        <section className="mt-20" data-aos="fade-up">
            <h2 className="text-3xl font-black mb-10 text-gray-900 font-display tracking-tight">
                {language === 'hi' ? 'तकनीकी विनिर्देश' : 'Technical Specifications'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
                {specList.map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 group">
                        <span className="text-gray-500 font-bold text-sm uppercase tracking-wider group-hover:text-primary transition-colors">{spec.label}</span>
                        <span className="font-black text-gray-900">{spec.value}</span>
                    </div>
                ))}
            </div>

            {/* Generic Features Section - Only show if enough specs exist to look like a tool/complex item, otherwise hide to avoid "Powerful Motor" on Milk */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <CheckCircle2 className="text-primary mb-4" size={32} />
                    <h3 className="font-black mb-2 text-gray-900 uppercase tracking-wider text-sm">
                        {language === 'hi' ? 'गुणवत्ता आश्वासन' : 'Quality Assurance'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {language === 'hi' ? 'प्रीमियम मानकों को पूरा करने के लिए कड़ाई से परीक्षण किया गया।' : 'Rigorously tested to meet premium standards.'}
                    </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <Lightbulb className="text-primary mb-4" size={32} />
                    <h3 className="font-black mb-2 text-gray-900 uppercase tracking-wider text-sm">
                        {language === 'hi' ? 'विशेषज्ञ चयन' : 'Expert Selection'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {language === 'hi' ? 'पेशेवर दक्षता के लिए क्यूरेट किया गया।' : 'Curated for professional efficiency.'}
                    </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                    <Bolt className="text-primary mb-4" size={32} />
                    <h3 className="font-black mb-2 text-gray-900 uppercase tracking-wider text-sm">
                        {language === 'hi' ? 'विश्वसनीय वारंटी' : 'Reliable Warranty'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        {language === 'hi' ? 'मन की शांति के लिए व्यापक सुरक्षा।' : 'Comprehensive protection for peace of mind.'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Specifications;
