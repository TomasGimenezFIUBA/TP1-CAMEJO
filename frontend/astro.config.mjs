import { defineConfig } from 'astro/config';
import auth from 'auth-astro';
import vercel from '@astrojs/vercel/serverless';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
import viteConfig from './vite.config.js';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), auth(), react()],
  output: 'server',
  adapter: vercel(),
  vite: viteConfig, // <- Add this line to fix the Vite build error
});