// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mauricloudz.github.io',
  base: '/landing-remakes',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Mantiene el prefijo -webkit-backdrop-filter (Safari 16-17) en el CSS final.
      cssTarget: ['chrome111', 'safari16.4', 'firefox114', 'ios16.4'],
    },
  },
});
