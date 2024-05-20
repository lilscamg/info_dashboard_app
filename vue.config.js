const { defineConfig } = require('@vue/cli-service');
const Dotenv = require('dotenv-webpack');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/info-dashboard-app/'
    : '/',
  outputDir: 'docs',
  assetsDir: '',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new Dotenv(),
    ],
  },
});