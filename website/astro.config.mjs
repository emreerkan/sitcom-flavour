// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ada.tools',
  base: '/sitcom-flavour',
  trailingSlash: 'ignore',
  vite: {
    // The page reads the plugin's banks from the repo root at build time.
    server: { fs: { allow: ['..'] } },
  },
});
