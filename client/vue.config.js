const { defineConfig } = require("@vue/cli-service");
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
});
