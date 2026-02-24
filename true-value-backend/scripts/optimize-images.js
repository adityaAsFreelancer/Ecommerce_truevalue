const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads');

async function optimizeImages() {
    console.log('Starting image optimization...');

    if (!fs.existsSync(uploadDir)) {
        console.error('Uploads directory not found');
        return;
    }

    const files = fs.readdirSync(uploadDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
    let processed = 0;
    let savedSpace = 0;

    for (const file of files) {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);

        // Skip if already small (e.g. < 200KB)
        if (stats.size < 200 * 1024) continue;

        const tempPath = path.join(uploadDir, `temp-${file}`);

        try {
            await sharp(filePath)
                .resize(800, 800, {
                    fit: 'inside',
                    withoutEnlargement: true
                }) // Max 800x800
                .jpeg({ quality: 80, mozjpeg: true }) // Compress
                .toFile(tempPath);

            const newStats = fs.statSync(tempPath);

            // Replace original with optimized
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);

            const saving = stats.size - newStats.size;
            savedSpace += saving;
            processed++;

            process.stdout.write('.');
        } catch (error) {
            console.error(`\nError optimizing ${file}:`, error.message);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }

    console.log(`\n\nOptimization complete!`);
    console.log(`Processed: ${processed} images`);
    console.log(`Saved: ${(savedSpace / 1024 / 1024).toFixed(2)} MB`);
}

optimizeImages();
