import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port: 5173, // Or 3000 or whatever port you want
  },
});
