import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/soumission': 'http://localhost:8000',
      '/csrf-token': 'http://localhost:8000',
      '/form-data': 'http://localhost:8000',
    },
  },
});

