export const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=No+Image';
    if (path.startsWith('http')) return path;
    return `https://true-value-web-backend.onrender.com/uploads/${path}`;
};
