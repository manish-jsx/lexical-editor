import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    typescript({ 
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true,
      declaration: true,
      declarationDir: 'dist',
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        'node_modules',
        'src/App.tsx',
        'src/Components/**/*',
        'src/constants/**/*',
        'src/nodes/**/*',
        'src/Plugins/**/*',
        'src/api/**/*',
        'src/examples/**/*'
      ]
    }),
    postcss({
      extensions: ['.css', '.scss'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
      extract: false,
    }),
  ],
  external: [
    'react', 
    'react-dom', 
    'lexical', 
    '@lexical/react',
    '@vercel/blob',
    '@neondatabase/serverless'
  ]
};
