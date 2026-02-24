import React from 'react';
import { ChevronRight, Home as HomeIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
    const { t } = useLanguage();

    return (
        <nav className="flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
            <Link
                to="/"
                className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-all text-[11px] font-black uppercase tracking-widest group"
            >
                <div className="bg-gray-50 group-hover:bg-primary/10 p-1.5 rounded-lg transition-colors">
                    <HomeIcon size={14} />
                </div>
                <span>{t('nav', 'home')}</span>
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={12} className="text-gray-300" />
                    {item.active ? (
                        <span className="text-gray-900 font-black text-[11px] uppercase tracking-widest bg-gray-50 px-2.5 py-1.5 rounded-lg">
                            {item.label}
                        </span>
                    ) : (
                        <Link
                            to={item.to || "#"}
                            className="text-gray-400 hover:text-primary transition-all text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 px-2.5 py-1.5 rounded-lg"
                        >
                            {item.label}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
