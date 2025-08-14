import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import svgr from 'vite-plugin-svgr';

  export default defineConfig({
    plugins: [react(), svgr()],
    server: {
      port: 5173,
      proxy: {
        '/soumission': 'http://localhost:8000',
        '/csrf-token': 'http://localhost:8000',
        '/form-data': 'http://localhost:8000',
      },
    },
  });