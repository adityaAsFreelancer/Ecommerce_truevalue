const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, 'image-mapping.json');
const frontendDataDir = path.join(__dirname, '../../true-value-frontend/src/data');
const contextDir = path.join(__dirname, '../../true-value-frontend/src/context');

if (!fs.existsSync(mappingPath)) {
    console.error('Mapping file not found!');
    process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Copy of the array from download-images.js
const imagesToDownload = [
    // Products
    { id: 'v1', url: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?auto=format&fit=crop&q=80" },
    { id: 'v2', url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80" },
    { id: 'v3', url: "https://images.unsplash.com/photo-1518977676601-b53f82ber75?auto=format&fit=crop&q=80" },
    { id: 'v4', url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80" },
    { id: 'v5', url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80" },
    { id: 'f1', url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80" },
    { id: 'f2', url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80" },
    { id: 'f3', url: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80" },
    { id: 'f4', url: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80" },
    { id: 'm1', url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80" },
    { id: 'm2', url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80" },
    { id: 'm3', url: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&q=80" },
    { id: 'm4', url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80" },
    { id: 's1', url: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&q=80" },
    { id: 's2', url: "https://images.unsplash.com/photo-1565680018093-ebb6d3d9aa2a?auto=format&fit=crop&q=80" },
    { id: 'd1', url: "https://images.unsplash.com/photo-1563636619-e91000f88fca?auto=format&fit=crop&q=80" },
    { id: 'd2', url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80" },
    { id: 'd3', url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80" },
    { id: 'd4', url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80" },
    { id: 'c1', url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80" },
    { id: 'c2', url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80" },
    { id: 'c3', url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80" },
    { id: 'c4', url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80" },
    { id: 'c5', url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&q=80" },
    { id: 'c6', url: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80" },
    { id: 'b1', url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80" },
    { id: 'b2', url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80" },
    { id: 'b3', url: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&q=80" },
    { id: 'b4', url: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80" },
    { id: 'sn1', url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80" },
    { id: 'sn2', url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80" },
    { id: 'sn3', url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80" },
    { id: 'cl1', url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80" },
    { id: 'cl2', url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80" },
    { id: 'cl3', url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80" },
    { id: 'cl4', url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80" },
    { id: 'e1', url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80" },
    { id: 'e2', url: "https://images.unsplash.com/photo-1558618047-f4b4ca99dc71?auto=format&fit=crop&q=80" },
    { id: 'e3', url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80" },
    { id: 'e4', url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80" },
    { id: 'e5', url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80" },
    { id: 'pc1', url: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80" },
    { id: 'pc2', url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80" },
    { id: 'pc3', url: "https://images.unsplash.com/photo-1628359355624-855775b5c9c4?auto=format&fit=crop&q=80" },
    { id: 'pc4', url: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80" },
    { id: 'ph1', url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80" },
    { id: 'ph2', url: "https://images.unsplash.com/photo-1603398938378-e54eab446f25?auto=format&fit=crop&q=80" },
    { id: 'ph3', url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80" },
    { id: 'hk1', url: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&q=80" },
    { id: 'hk2', url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80" },
    { id: 'hk3', url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80" },
    { id: 'a1', url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    { id: 'a2', url: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80" },
    { id: 'a3', url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" },
    { id: 'a4', url: "https://images.unsplash.com/photo-1581850518616-bcb8188c4436?auto=format&fit=crop&w=800&q=80" },
    { id: 'cat1', url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80" },
    { id: 'cat2', url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80" },
    { id: 'cat3', url: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80" },
    { id: 'cat4', url: "https://images.unsplash.com/photo-1416879895669-b9d097284c63?auto=format&fit=crop&q=80" },
    { id: 'cat5', url: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80" },
];

const filesToUpdate = [
    path.join(frontendDataDir, 'products.js'),
    path.join(frontendDataDir, 'siteData.js'),
];

console.log('Starting frontend update...');

filesToUpdate.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let updatedCount = 0;

        imagesToDownload.forEach(img => {
            const localFilename = mapping[img.id];
            // Only replace if we have a mapping AND the content has the URL
            if (localFilename && content.includes(img.url)) {
                // Determine new URL
                const newUrl = `http://localhost:5000/uploads/${localFilename}`;

                // Replace globally (split/join)
                const parts = content.split(img.url);
                if (parts.length > 1) {
                    content = parts.join(newUrl);
                    updatedCount += (parts.length - 1);
                }
            }
        });

        if (updatedCount > 0) {
            fs.writeFileSync(file, content);
            console.log(`Updated ${path.basename(file)}: ${updatedCount} replacements.`);
        } else {
            console.log(`No changes needed for ${path.basename(file)}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
