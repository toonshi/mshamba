import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@backend': path.resolve(__dirname, './src/declarations/mshamba_backend')
    }
  }
});
