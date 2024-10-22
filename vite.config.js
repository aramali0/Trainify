import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // This is the default value
  },
  plugins: [react()],
  define: {
    global: 'window',
  },
  // server: {
  //   port: 3002, // Replace with your desired port
  // },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/styled-engine'
    ]
  },
});
