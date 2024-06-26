import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base:'./',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //启用代理解决跨域问题(只适用开发环境)
  server:{
    proxy:{
      '/api':{
        target: 'http://errorserver.top:5005',
        //target: 'http://10.7.62.164:8080',
        changeOrigin: true,
        rewrite: (path)=> path.replace(/^\/api/, '')
      }
    }
  }
})
