const BASE_URL = 'https://ecommerce-truevalue.onrender.com/api';

const api = async (endpoint, options = {}) => {
    // Priority: options.token > localStorage
    const token = options.token || localStorage.getItem('truevalue_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        throw new Error(text || 'Server Error');
    }

    if (!response.ok) {
        throw new Error(data?.message || 'Something went wrong');
    }

    return data;
};

export { api };
export default api;
