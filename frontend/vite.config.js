import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import { dirname, resolve } from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081
  },
  plugins: [
    vue(), 
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), "./src/locales/**")
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})