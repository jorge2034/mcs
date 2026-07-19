// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

export default defineConfig({
  site: 'https://mineracordilleradelsur.com.bo',

  integrations: [
    vue({ appEntrypoint: '/src/lib/vue-app.ts' }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    remotePatterns: [{ protocol: 'https' }],
  },

  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),
});