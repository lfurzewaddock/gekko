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
  // browser/ui target does not require/support 'loadModules',
  // therefore safe to ignore Rsbuild warning
  // ⚠ Critical dependency: the request of a dependency is an expression
  // see: https://github.com/jeffijoe/awilix/issues/426
  tools: {
    rspack: {
      ignoreWarnings: [
        {
          message: /Critical dependency:\s+the request of a dependency is an expression/i,
          module: /awilix/i,
        },
      ],
    },
  },
  // tools: {
  //   // This stops Lightning CSS from transforming your CSS
  //   lightningcssLoader: false,
  // },
});
