import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as esbuild from 'esbuild';

const jsxForJsPlugin = (): Plugin => ({
  name: 'jsx-for-js-files',
  enforce: 'pre',
  async transform(code, id) {
    const isTarget = id.endsWith('.js') && (
      id.includes('/Pages/') || id.includes('\\Pages\\') ||
      id.includes('/Components/') || id.includes('\\Components\\') ||
      id.endsWith('/Layout.js') || id.endsWith('\\Layout.js')
    );
    if (!isTarget) return null;
    const result = await esbuild.transform(code, { loader: 'jsx', sourcemap: true });
    return { code: result.code, map: result.map };
  },
});

export default defineConfig({
  plugins: [jsxForJsPlugin(), react()],
  resolve: {
    alias: {
      // Place specific aliases first so they take precedence over '@'
      '@/entities': path.resolve(__dirname, './Entites'),
      '@/components': path.resolve(__dirname, './Components'),
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
