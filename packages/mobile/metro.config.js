// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for CommonJS modules
config.resolver.sourceExts.push('cjs', 'mjs');

// Ensure proper module resolution for node_modules
config.resolver.unstable_enablePackageExports = true;

module.exports = config;

