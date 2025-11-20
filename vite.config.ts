import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Expose các biến VITE_API_KEY để code có thể đọc được
      'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.VITE_API_KEY),
      'import.meta.env.VITE_API_KEY_2': JSON.stringify(env.VITE_API_KEY_2 || process.env.VITE_API_KEY_2),
      'import.meta.env.VITE_API_KEY_3': JSON.stringify(env.VITE_API_KEY_3 || process.env.VITE_API_KEY_3),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
