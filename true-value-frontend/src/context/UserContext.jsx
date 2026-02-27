import React, { createContext, useContext, useState, useEffect } from 'react';
import showAlert from '../utils/swal';
import api from '../utils/api';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('truevalue_token'));
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const fetchMyOrders = async () => {
        if (!token) return;
        try {
            const data = await api('/orders/myorders', { token });
            const fetchedOrders = Array.isArray(data) ? data : (data.data || []);
            const normalized = fetchedOrders.map(o => ({
                ...o,
                id: o._id || o.id,
                items: o.orderItems || o.items || [],
                total: o.totalPrice || o.total || 0,
                date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A'
            }));
            setOrders(normalized);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    // --- Fetch initial data if token exists ---
    useEffect(() => {
        const loadProfile = async () => {
            if (token) {
                try {
                    const response = await api('/auth/profile', { token });
                    const profileData = response.data || response;
                    setUser(profileData);
                    setAddresses(profileData.addresses || []);

                    // Fetch real orders from backend
                    await fetchMyOrders();

                    const savedWishlist = localStorage.getItem('truevalue_wishlist');
                    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
                } catch (error) {
                    console.error('Failed to load profile:', error);
                    logout();
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        loadProfile();
    }, [token]);
    useEffect(() => {
        if (token) {
            localStorage.setItem('truevalue_token', token);
        } else {
            localStorage.removeItem('truevalue_token');
        }
    }, [token]);

    useEffect(() => { if (user) localStorage.setItem('truevalue_user', JSON.stringify(user)); else localStorage.removeItem('truevalue_user'); }, [user]);
    useEffect(() => { localStorage.setItem('truevalue_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

    // --- User Actions ---
    const login = async (credentials) => {
        try {
            const data = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            setToken(data.token);
            setUser({
                id: data.id || data._id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                role: data.role || 'user'
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const registerUser = async (userData) => {
        try {
            const data = await api('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            setToken(data.token);
            setUser({
                id: data.id || data._id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                role: data.role || 'user'
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAddresses([]);
        setOrders([]);
        setWishlist([]);
        localStorage.removeItem('truevalue_token');
        localStorage.removeItem('truevalue_user');
    };

    const updateUser = async (data) => {
        try {
            const response = await api('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(data),
                token
            });
            const updatedUser = response.data || response;
            setUser(prev => ({ ...prev, ...updatedUser }));
            return updatedUser;
        } catch (error) {
            console.error("Update fail:", error);
            throw error;
        }
    };

    const uploadAvatar = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Using raw fetch because our api helper doesn't support FormData yet
            const response = await fetch('http://localhost:5000/api/upload/single', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token || localStorage.getItem('truevalue_token')}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');

            // Update profile with new avatar URL
            return await updateUser({ avatar: data.data.url });
        } catch (error) {
            console.error("Avatar upload fail:", error);
            throw error;
        }
    };

    // --- Address Actions ---
    const addAddress = async (newAddress) => {
        const updatedAddresses = [...addresses, { ...newAddress, id: Date.now(), isDefault: addresses.length === 0 }];
        try {
            const response = await api('/auth/addresses', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
                token
            });
            const updatedProfile = response.data || response;
            setAddresses(updatedProfile.addresses || []);
        } catch (error) {
            showAlert.error({ title: "Error", text: error.message });
        }
    };

    const updateAddress = async (updatedAddress) => {
        const updatedAddresses = addresses.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr);
        try {
            const response = await api('/auth/addresses', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
                token
            });
            const updatedProfile = response.data || response;
            setAddresses(updatedProfile.addresses || []);
        } catch (error) {
            showAlert.error({ title: "Error", text: error.message });
        }
    };

    const deleteAddress = async (addressId) => {
        const addressToDelete = addresses.find(addr => addr.id === addressId);
        if (addressToDelete?.isDefault && addresses.length > 1) {
            showAlert.warning({ title: "Cannot Delete", text: "Please set another address as default before deleting this one." });
            return;
        }
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        try {
            const response = await api('/auth/addresses', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
                token
            });
            const updatedProfile = response.data || response;
            setAddresses(updatedProfile.addresses || []);
        } catch (error) {
            showAlert.error({ title: "Error", text: error.message });
        }
    };

    const setDefaultAddress = async (addressId) => {
        const updatedAddresses = addresses.map(addr => ({ ...addr, isDefault: addr.id === addressId }));
        try {
            const response = await api('/auth/addresses', {
                method: 'PUT',
                body: JSON.stringify({ addresses: updatedAddresses }),
                token
            });
            const updatedProfile = response.data || response;
            setAddresses(updatedProfile.addresses || []);
        } catch (error) {
            showAlert.error({ title: "Error", text: error.message });
        }
    };

    // --- Wishlist Actions ---
    const toggleWishlist = (product) => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        if (isInWishlist) {
            setWishlist(wishlist.filter(item => item.id !== product.id));
            showAlert.info({ title: "Removed", text: `${product.name} removed from wishlist` });
        } else {
            setWishlist([...wishlist, product]);
            showAlert.success({ title: "Added", text: `${product.name} added to wishlist` });
        }
    };

    // --- Order Actions ---
    const placeOrderAction = async (cartItems, total, shippingAddress, discountAmount = 0, couponCode = null, paymentMethod = 'card') => {
        if (!user) throw new Error("User must be logged in to place an order.");

        const orderData = {
            orderItems: cartItems.map(item => {
                let imageUrl = item.img || '';
                if (item.images && item.images.length > 0) {
                    const firstImg = item.images[0];
                    imageUrl = typeof firstImg === 'string' ? firstImg : (firstImg.url || firstImg);
                }

                return {
                    product: item.id || item._id,
                    name: item.name,
                    qty: item.quantity,
                    image: imageUrl,
                    price: item.price
                };
            }),
            shippingAddress: {
                address: shippingAddress.street,
                city: shippingAddress.city,
                postalCode: shippingAddress.zip,
                state: shippingAddress.state,
                country: shippingAddress.country || 'India'
            },
            paymentMethod,
            totalPrice: total,
            discountAmount,
            couponCode
        };

        try {
            const response = await api('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData),
                token
            });
            const newOrder = response.data || response;

            // Normalize for frontend
            const normalizedOrder = {
                ...newOrder,
                id: newOrder._id || newOrder.id,
                items: newOrder.orderItems || [],
                total: newOrder.totalPrice, // Use backend calculated total
                date: newOrder.createdAt ? new Date(newOrder.createdAt).toLocaleDateString('en-IN') : 'Today'
            };

            // Re-fetch all orders from backend to stay in sync
            await fetchMyOrders();
            return normalizedOrder;
        } catch (error) {
            throw error;
        }
    };

    // --- Notifications State ---
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const data = await api('/notifications', { token });
            const notifs = data.data || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markNotificationAsRead = async (id) => {
        try {
            await api(`/notifications/${id}/read`, { method: 'PUT', token });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await api('/notifications', { method: 'DELETE', token });
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }
    };

    // --- Polling for Notifications ---
    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // 30 sec polling
            return () => clearInterval(interval);
        }
    }, [token]);

    const isAuthenticated = !!user;

    return (
        <UserContext.Provider value={{
            user, loading, login, logout, registerUser, updateUser, isAuthenticated,
            addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
            orders, placeOrder: placeOrderAction, fetchMyOrders,
            wishlist, toggleWishlist,
            notifications, unreadCount, markNotificationAsRead, clearAllNotifications, fetchNotifications
        }}>
            {children}
        </UserContext.Provider>
    );
};
