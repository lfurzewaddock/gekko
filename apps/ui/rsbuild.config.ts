import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3001,
  },
  source: {
    define: {
      'process.env.API_URL_PUBLIC_BASE':
        JSON.stringify(process.env.API_URL_PUBLIC_BASE) || undefined,
    },
  },
});
