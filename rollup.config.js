import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.browser.js',
        format: 'umd',
        name: 'LexicalEditorEasy',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          lexical: 'Lexical',
          '@lexical/react': 'LexicalReact',
        },
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      postcss(),
      terser(),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      '@babel/runtime',
    ],
  },
  // Browser-only bundle
  {
    input: 'src/index.browser.ts',
    output: {
      file: 'dist/index.browser.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        preferBuiltins: false, // Prefer the browser implementations
      }),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        compilerOptions: {
          jsx: 'react-jsx',
        },
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        presets: [
          '@babel/preset-env',
          '@babel/preset-react',
          '@babel/preset-typescript',
        ],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      postcss(),
      terser(),
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      '@babel/runtime',
      'fs',
      'net',
      'tls',
      'crypto',
      'stream',
      'stream/web',
      'util',
      'buffer',
      'path',
    ],
  }
];
