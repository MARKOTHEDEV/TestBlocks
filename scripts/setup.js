#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Hybrid QA Test Builder...\n');

try {
  // Check Node version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 20) {
    console.error('❌ Node.js 20+ is required. Current version:', nodeVersion);
    process.exit(1);
  }
  
  console.log('✅ Node.js version:', nodeVersion);

  // Check pnpm
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    console.log('✅ pnpm version:', pnpmVersion);
  } catch (error) {
    console.error('❌ pnpm is not installed. Please install it first:');
    console.error('   npm install -g pnpm');
    process.exit(1);
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build packages
  console.log('\n🔨 Building packages...');
  execSync('pnpm build', { stdio: 'inherit' });

  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Start the sample site: pnpm dev:sample-site');
  console.log('2. Start the builder: pnpm dev:builder');
  console.log('3. Load the Chrome extension from packages/extension/dist/');
  console.log('4. Open http://localhost:5174 and http://localhost:5173');
  console.log('\nHappy testing! 🧪');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
