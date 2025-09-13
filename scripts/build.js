#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy SDK to sample site
const sdkSource = path.join(__dirname, '../packages/sdk/dist/qa-tagger.v1.js');
const sampleSiteDest = path.join(__dirname, '../apps/sample-site/public/qa-tagger.v1.js');
const extensionDest = path.join(__dirname, '../packages/extension/dist/qa-tagger.v1.js');

// Ensure directories exist
fs.mkdirSync(path.dirname(sampleSiteDest), { recursive: true });
fs.mkdirSync(path.dirname(extensionDest), { recursive: true });

// Copy SDK file
if (fs.existsSync(sdkSource)) {
  fs.copyFileSync(sdkSource, sampleSiteDest);
  fs.copyFileSync(sdkSource, extensionDest);
  console.log('✅ SDK copied to sample site and extension');
} else {
  console.log('⚠️  SDK not found, run "pnpm build:sdk" first');
}

// Copy extension files
const extensionSrc = path.join(__dirname, '../packages/extension/src');
const extensionDist = path.join(__dirname, '../packages/extension/dist');

if (fs.existsSync(extensionSrc)) {
  // Copy all files except .ts files (they should be compiled)
  const files = fs.readdirSync(extensionSrc);
  files.forEach(file => {
    if (!file.endsWith('.ts')) {
      const srcPath = path.join(extensionSrc, file);
      const destPath = path.join(extensionDist, file);
      if (fs.statSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
  console.log('✅ Extension files copied');
}

function copyDir(src, dest) {
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
