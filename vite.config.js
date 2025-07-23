import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteRequireContext from '@originjs/vite-plugin-require-context'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
          `,
          silenceDeprecations: ['legacy-js-api'],
        }
      }
    },
    publicDir: env.NODE_ENV === 'development' ? true : false,
    build: {
      lib: {
        entry: 'lib/index.js',
        name: 'vue3-router-tab',
        // formats: ['cjs', 'umd', 'es'],
        formats: ['umd', 'es'],
        fileName: (format) => `vue3-router-tab.${format}.js`
      },
      minify: false,
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
          exports: 'auto',
          assetFileNames: (assetInfo) => {
            return assetInfo.name === 'style.css' ? 'vue-router-tab.css' : assetInfo.name
          }
        }
      }
    }
  }
})
