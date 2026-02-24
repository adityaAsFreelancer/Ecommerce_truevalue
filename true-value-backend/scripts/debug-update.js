const fs = require('fs');
const path = require('path');

const downloadScript = fs.readFileSync(path.join(__dirname, 'download-images.js'), 'utf8');

// Extract the array
const weirdRegex = /const imagesToDownload = \[([\s\S]*?)\];/;
const match = downloadScript.match(weirdRegex);

if (!match) {
    console.log('Regex failed to match array block');
    process.exit(1);
}

const arrayContent = match[1];
console.log('Array content length:', arrayContent.length);

const urlRegex = /id:\s*'([^']+)',\s*url:\s*"([^"]+)"/g;
let m;
let count = 0;
while ((m = urlRegex.exec(arrayContent)) !== null) {
    const id = m[1];
    const url = m[2];
    console.log(`Found: ${id}`);
    count++;
    if (count < 5) console.log(`  URL: ${url}`);
}

console.log(`Total items found: ${count}`);

const productsPath = path.join(__dirname, '../../true-value-frontend/src/data/products.js');
const productsContent = fs.readFileSync(productsPath, 'utf8');
const v1Url = "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?auto=format&fit=crop&q=80";

if (productsContent.includes(v1Url)) {
    console.log('products.js DOES contain v1 ID URL');
} else {
    console.log('products.js does NOT contain v1 ID URL');
}
