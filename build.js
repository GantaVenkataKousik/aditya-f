const { execSync } = require('child_process');
const fs = require('fs');

// Split the build process into smaller chunks
console.log('🔄 Starting optimized build process...');

// Step 1: Clean any previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
}

// Step 2: Build with minimal features first
console.log('🏗️ Building with minimal features...');
execSync('vite build --emptyOutDir --minify=esbuild --sourcemap=false', {
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' },
    stdio: 'inherit'
});

console.log('✅ Build completed successfully!'); 