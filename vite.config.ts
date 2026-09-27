import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          academic: path.resolve(__dirname, 'academic.html'),
          studentLife: path.resolve(__dirname, 'student-life.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          news: path.resolve(__dirname, 'news.html'),
          newsDetail: path.resolve(__dirname, 'news-detail.html'),
          admissions: path.resolve(__dirname, 'admissions.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          sds: path.resolve(__dirname, 'sds-parents.html'),
          downloads: path.resolve(__dirname, 'downloads.html'),
          privacy: path.resolve(__dirname, 'privacy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          notFound: path.resolve(__dirname, '404.html'),
          manager: path.resolve(__dirname, 'xk92m-manage/index.html')
        }
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
