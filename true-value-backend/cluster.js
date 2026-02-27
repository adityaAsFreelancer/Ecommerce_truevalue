const cluster = require('cluster');
const os = require('os');

const NUM_WORKERS = os.cpus().length;

if (cluster.isMaster) {
    console.log(`\n🚀 Master process ${process.pid} is running`);
    console.log(`⚡ Starting ${NUM_WORKERS} workers (one per CPU core)...\n`);

    // Fork a worker for each CPU core
    for (let i = 0; i < NUM_WORKERS; i++) {
        cluster.fork();
    }

    // If a worker dies, restart it automatically
    cluster.on('exit', (worker, code, signal) => {
        console.log(`\n⚠️  Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
        console.log('🔄 Restarting worker...\n');
        cluster.fork();
    });

    cluster.on('online', (worker) => {
        console.log(`✅ Worker ${worker.process.pid} is online`);
    });

} else {
    // Each worker runs the actual Express server
    require('./server.js');
    console.log(`🔧 Worker ${process.pid} started`);
}
