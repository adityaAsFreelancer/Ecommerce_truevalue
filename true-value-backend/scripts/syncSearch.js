const dotenv = require('dotenv');
const { AppDataSource } = require('../config/database');
const SearchService = require('../utils/searchService');

dotenv.config();

const bulkIndex = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Connected to Database for Bulk Sync...');

        const productRepo = AppDataSource.getRepository('Product');
        const products = await productRepo.find({
            where: { isActive: true },
            relations: ['category', 'vendor', 'variants'] // Include relations for full search data
        });

        console.log(`Found ${products.length} active products to sync.`);

        for (const product of products) {
            await SearchService.syncProduct(product);
        }

        console.log('Bulk Indexing Successful! 🚀');
        process.exit();
    } catch (err) {
        console.error('Bulk Sync Failed:', err.message);
        process.exit(1);
    }
};

bulkIndex();
