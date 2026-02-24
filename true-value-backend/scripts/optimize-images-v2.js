const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads');
const mappingPath = path.join(__dirname, 'image-mapping.json');

async function optimizeImages() {
    console.log('Starting V2 optimization (Safe Mode)...');

    if (!fs.existsSync(mappingPath)) {
        console.error('Mapping file not found');
        return;
    }

    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    const newMapping = { ...mapping };
    let processed = 0;

    for (const [id, filename] of Object.entries(mapping)) {
        // Skip if already optimized (starts with opt-)
        if (filename.startsWith('opt-')) continue;

        const inputPath = path.join(uploadDir, filename);
        if (!fs.existsSync(inputPath)) {
            console.log(`Missing file: ${filename}`);
            continue;
        }

        const newFilename = `opt-${filename}`;
        const outputPath = path.join(uploadDir, newFilename);

        try {
            await sharp(inputPath)
                .resize(800, 800, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 70, mozjpeg: true })
                .toFile(outputPath);

            // Update mapping to point to optimized file
            newMapping[id] = newFilename;
            processed++;
            process.stdout.write('.');
        } catch (error) {
            console.error(`\nError optimizing ${filename}:`, error.message);
        }
    }

    console.log(`\n\nOptimization complete! Processed ${processed} images.`);

    // Update the mapping file
    fs.writeFileSync(mappingPath, JSON.stringify(newMapping, null, 2));
    console.log('Updated image-mapping.json with optimized filenames.');
}

optimizeImages();
