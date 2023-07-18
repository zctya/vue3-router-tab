import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteRequireContext(),
    nodePolyfills({
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "src/assets/scss/variables.scss" as *;
        `
      }
    }
  },
  // publicDir: false,
  build: {
    lib: {
      entry: 'lib/index.js',
      name: 'vue-router-tab',
      fileName: 'vue-router-tab',
      formats: ['cjs', 'umd', 'es']
    },
    minify: false,
    rollupOptions: {
      // external: ['vue', 'vue-router'],
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name === 'style.css' ? 'vue-router-tab.css' : assetInfo.name
        }
      }
    }
  }
})
