import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const ProductsContext = createContext();

export const useProducts = () => {
    return useContext(ProductsContext);
};

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 12
    });

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: params.page || 1,
                limit: params.limit || 12,
                ...params
            });

            if (searchQuery) queryParams.set('search', searchQuery);
            if (activeCategory) queryParams.set('category', activeCategory);

            const response = await api(`/products?${queryParams.toString()}`);

            // Backend returns { success: true, count: X, pagination: {...}, data: [...] }
            const rawData = response.data || [];
            const paginationData = response.pagination || {};

            // Map backend product structure to frontend expectations
            const mappedProducts = rawData.map(p => ({
                id: p._id,
                name: p.name,
                description: p.description,
                price: p.price,
                salePrice: p.salePrice,
                category: p.category?.name || p.category, // Handle populated category
                vendor: p.vendor,
                images: p.images,
                // Ensure img exists for components expecting it
                img: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/300',
                stock: p.stock,
                rating: p.rating || 0,
                numReviews: p.numReviews || 0,
                createdAt: p.createdAt
            }));

            setProducts(mappedProducts);
            setPagination({
                page: paginationData.page || 1,
                pages: paginationData.pages || 1,
                total: response.count || rawData.length,
                limit: params.limit || 12
            });
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, activeCategory]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api('/categories');
            setCategories(response.data || response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    const fetchBanners = useCallback(async () => {
        try {
            const response = await api('/banners');
            setBanners(response.data || response);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        fetchCategories();
        fetchBanners();
    }, [fetchCategories, fetchBanners]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) setActiveCategory(null);
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        if (category) setSearchQuery('');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setActiveCategory(null);
    };

    const getProductById = async (id) => {
        try {
            const response = await api(`/products/${id}`);
            const p = response.data || response;
            return {
                id: p._id,
                name: p.name,
                description: p.description,
                price: p.price,
                salePrice: p.salePrice,
                category: p.category?.name || p.category,
                vendor: p.vendor,
                images: p.images,
                img: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/300',
                stock: p.stock,
                rating: p.rating || 0,
                numReviews: p.numReviews || 0,
                createdAt: p.createdAt
            };
        } catch (error) {
            console.error('Failed to get product:', error);
            return null;
        }
    };

    const changePage = (page) => {
        fetchProducts({ page });
    };

    return (
        <ProductsContext.Provider value={{
            products,
            categories,
            loading,
            pagination,
            searchQuery,
            activeCategory,
            selectedProduct,
            setSelectedProduct,
            handleSearch,
            handleCategoryFilter,
            resetFilters,
            getProductById,
            changePage,
            refreshProducts: fetchProducts,
            banners,
            refreshBanners: fetchBanners
        }}>
            {children}
        </ProductsContext.Provider>
    );
};
