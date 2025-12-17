import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import path from 'path';

rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader', // ✅ Necessário para Tailwind funcionar!
  ],
});

export const rendererConfig: Configuration = {
  entry: './src/renderer/renderer.tsx',
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.json',
      '.png',
      '.jpg',
      '.jpeg',
      '.svg',
    ],
    alias: {
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
};
