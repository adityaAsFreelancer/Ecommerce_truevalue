const axios = require('axios');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(uploadDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('Uploads dir:', uploadDir);
console.log('Placeholder exists:', fs.existsSync(path.join(uploadDir, 'placeholder.jpg')));

async function test() {
    console.log('Starting test...');
    try {
        const url = "https://placehold.co/600x600/F3F4F6/9CA3AF/png?text=Product+Image";
        console.log('Requesting:', url);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*'
            },
            timeout: 5000
        });
        console.log('Response received:', response.status);

        const dest = path.join(uploadDir, 'test-download.jpg');
        const writer = fs.createWriteStream(dest);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        console.log('Download complete to', dest);
    } catch (e) {
        console.error('Test failed:', e.message);
    }
}

test();
