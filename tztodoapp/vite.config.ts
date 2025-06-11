import { defineConfig } from 'vite'; // ✅ 이 줄 반드시 필요!
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/theme/variables.scss";`
      }
    }
  },
  server: {
    port: 8083
  },
  build: {
    outDir: 'dist'
  }
});