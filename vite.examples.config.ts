import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite configuration for examples
export default defineConfig({
  plugins: [react()],
  root: 'examples',
  resolve: {
    alias: {
      // This allows importing directly from the src directory in examples
      '@src': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: '../examples-dist',
    sourcemap: true
  }
}); 
