const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add a rule to handle .mjs files
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      // Add CopyPlugin to copy token list directly to build folder
      webpackConfig.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/constants/token-list/token-list.json'),
              to: 'token-list/token-list.json', // This will go to the build output directory
            },
          ],
        })
      );

      return webpackConfig;
    },
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    before: (app, server) => {
      // Add specific middleware for token-list.json to ensure proper CORS headers
      app.get('/token-list/token-list.json', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Content-Type', 'application/json');
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        
        const tokenListPath = path.resolve(__dirname, 'public/token-list/token-list.json');
        res.sendFile(tokenListPath);
      });
    },
  },
  babel: {
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining'
    ]
  }
};