import React from 'react';

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
    loading = false,
    icon: Icon
}) => {
    const baseStyles = "relative flex items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

    const variants = {
        primary: "bg-primary text-[#111811] hover:brightness-105 shadow-lg shadow-primary/10",
        secondary: "bg-gray-50 text-[#111811] border border-gray-200 hover:bg-gray-100",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-[#111811]",
        ghost: "bg-transparent hover:bg-primary/10 text-primary border-none"
    };

    const sizes = "h-12 px-6 text-base";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="animate-pulse">Loading...</span>
                </div>
            ) : (
                <>
                    {Icon && <Icon size={20} />}
                    <span className="truncate">{children}</span>
                </>
            )}
        </button>
    );
};

export default Button;
