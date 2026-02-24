const algoliasearch = require('algoliasearch');

// Initialize Algolia
// In production, these should be in .env
const client = algoliasearch(
    process.env.ALGOLIA_APP_ID || 'latency',
    process.env.ALGOLIA_ADMIN_KEY || '6be0576ff61c053d5f9a3225e2a90f76'
);

const index = client.initIndex('products');

class SearchService {
    // Sync single product to Algolia
    async syncProduct(product) {
        try {
            const object = {
                objectID: product.id.toString(),
                name: product.name,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice,
                category: product.category,
                vendor: product.vendor,
                images: product.images,
                rating: product.rating,
                sku: product.sku,
                isActive: product.isActive,
                createdAt: product.createdAt
            };

            await index.saveObject(object);
            console.log(`Synced product ${product.id} to Algolia`);
        } catch (error) {
            console.error('Algolia Sync Error:', error.message);
        }
    }

    // Delete product from Algolia
    async deleteProduct(productId) {
        try {
            await index.deleteObject(productId.toString());
            console.log(`Deleted product ${productId} from Algolia`);
        } catch (error) {
            console.error('Algolia Delete Error:', error.message);
        }
    }

    // Faceted Search with Typo Tolerance
    async search(params) {
        const { query, filters, hitsPerPage = 12, page = 0 } = params;

        try {
            const result = await index.search(query, {
                filters: filters, // e.g. "price < 1000 AND rating > 4"
                hitsPerPage,
                page,
                facets: ['category', 'price', 'rating'],
                attributesToHighlight: ['name', 'description']
            });
            return result;
        } catch (error) {
            console.error('Algolia Search Error:', error.message);
            throw error;
        }
    }
}

module.exports = new SearchService();
