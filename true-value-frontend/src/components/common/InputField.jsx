import React from 'react';

const InputField = ({
    label,
    icon: Icon,
    error,
    register,
    name,
    rules,
    type = "text",
    placeholder,
    className = "",
    rightElement
}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-gray-900 text-xs font-black uppercase tracking-[0.1em] ml-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-stretch group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    {...(register ? register(name, rules) : {})}
                    type={type}
                    placeholder={placeholder}
                    className={`
            flex w-full rounded-xl text-gray-900 
            focus:outline-0 focus:ring-0
            border-2 transition-all duration-300 h-12 text-sm font-medium
            placeholder:text-gray-400
            ${Icon ? 'pl-11' : 'px-4'} 
            ${rightElement ? 'pr-12' : 'pr-4'}
            ${error
                            ? 'border-red-100 bg-red-50 focus:border-red-500'
                            : 'border-gray-100 bg-gray-50 focus:border-primary focus:bg-white focus:shadow-lg focus:shadow-primary/5'
                        }
            ${className}
          `}
                />
                {rightElement && (
                    <div className="absolute right-0 top-0 h-full flex items-center justify-center">
                        {rightElement}
                    </div>
                )}
            </div>
            {error && (
                <div className="flex items-center gap-1.5 mt-1 ml-1 text-red-500">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs font-semibold">{error.message}</p>
                </div>
            )}
        </div>

    );
};

export default InputField;
