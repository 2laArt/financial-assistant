const { defineConfig } = require('@vue/cli-service');


module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/variables.scss";`
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      test: /\.scss$/,
      preProcessor: 'scss',
      patterns: [
        './src/assets/styles/variables.scss',
      ]
    }
  }
})