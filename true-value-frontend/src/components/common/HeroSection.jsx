import React from 'react';
import { CheckCircle2, Truck } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="relative hidden lg:flex lg:w-1/2 bg-cover bg-center items-center justify-center p-12"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgamw9mz8UYLNeYb6WNJ6cIBlFyi2uQa6I9xDIlKAfZZVmr_RHzJ-T_MS6pFIEm8K0oYyb1NvoaiBlTRZHjTYxrSB8r5LldEJ4eGBfpoBalIpEXbT_OMYjOEgezqKJpoo3s40LLi1oVLix3P6KSnKtccKWEbyc0Se9yVeHM43P_j0v1i-VsUolC0fSb-7Q-J5OCFx_1_6xlMwOYThWwwx1_wQNpauOtV-1offBMU74NrzQ9STwKfOXovdO8UIuqh7_55fI7H5KXHhB')`
            }}>
            <div className="max-w-md text-white">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
                    Build More for Less.
                </h1>
                <p className="text-lg font-normal mb-8 leading-relaxed opacity-90">
                    Join the TrueValue community for exclusive deals, DIY tips, and early access to sales.
                </p>
                <div className="flex gap-4">
                    <div className="bg-primary/20 backdrop-blur-md p-4 rounded-lg border border-primary/30 flex items-center gap-3">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span className="text-sm font-semibold">Pro Membership</span>
                    </div>
                    <div className="bg-primary/20 backdrop-blur-md p-4 rounded-lg border border-primary/30 flex items-center gap-3">
                        <Truck className="text-primary w-5 h-5" />
                        <span className="text-sm font-semibold">Free Shipping</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
