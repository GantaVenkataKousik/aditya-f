// ES Module syntax
import { execSync } from 'child_process';
import fs from 'fs';

// Split the build process into smaller chunks
console.log('🔄 Starting optimized build process...');

// Step 1: Clean any previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {