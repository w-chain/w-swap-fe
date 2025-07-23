#!/usr/bin/env node

/**
 * Script to copy token-list.json from src/constants/token-list/ to public/token-list/
 * This ensures the token list is available both during development and in production builds
 */

const fs = require('fs');
const path = require('path');

const sourceFile = path.resolve(__dirname, '../src/constants/token-list/token-list.json');
const targetDir = path.resolve(__dirname, '../public/token-list');
const targetFile = path.resolve(targetDir, 'token-list.json');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('Created directory:', targetDir);
}

// Copy the file
try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log('Successfully copied token-list.json to public directory');
  console.log('Source:', sourceFile);
  console.log('Target:', targetFile);
} catch (error) {
  console.error('Error copying token-list.json:', error.message);
  process.exit(1);
}