import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onAction, actionLabel }) => {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-100 bg-white px-10 py-3 z-10 w-full">
            <div className="flex items-center gap-4 text-gray-900">
                <div className="size-6 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                    </svg>
                </div>
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em]">TrueValue</h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                    <Link className="text-gray-900 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/products">Shop</Link>
                    <Link className="text-gray-900 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/projects">Projects</Link>
                    <Link className="text-gray-900 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/deals">Deals</Link>
                </div>
                <button
                    onClick={onAction}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all"
                >
                    <span className="truncate">{actionLabel || 'Login'}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
