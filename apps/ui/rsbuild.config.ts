import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginCssMinimizer } from '@rsbuild/plugin-css-minimizer';

export default defineConfig({
  plugins: [pluginReact(), pluginCssMinimizer()],
  server: {
    port: 3001,
  },
  source: {
    define: {
      'process.env.API_URL_PUBLIC_BASE':
        JSON.stringify(process.env.API_URL_PUBLIC_BASE) || undefined,
    },
  },
  // tools: {
  //   // This stops Lightning CSS from transforming your CSS
  //   lightningcssLoader: false,
  // },
});
