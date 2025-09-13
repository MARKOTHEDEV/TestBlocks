import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/qa-tagger.ts',
  output: {
    file: 'dist/qa-tagger.v1.js',
    format: 'iife',
    name: 'QATagger',
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    terser({
      compress: {
        drop_console: true,
      },
    }),
  ],
  external: [],
};
