import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 px-6 md:px-12 py-8 mt-auto">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-sm font-medium text-gray-400">© 2026 TrueValue Home Improvement. All rights reserved.</p>
                <div className="flex flex-wrap justify-center gap-8">
                    <a className="text-sm font-bold text-gray-500 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4" href="#">Help Center</a>
                    <a className="text-sm font-bold text-gray-500 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4" href="#">Find a Store</a>
                    <a className="text-sm font-bold text-gray-500 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4" href="#">Accessibility</a>
                    <a className="text-sm font-bold text-gray-500 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4" href="#">Privacy & Terms</a>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
