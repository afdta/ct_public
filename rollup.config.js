import resolve from '@rollup/plugin-node-resolve';

export default {
  input: './build/js/main.js',
  output: {
    format: 'iife',
    file: './assets/app-es6v2dot1.js'
  },
  plugins: [resolve({mainFields:['module', 'browser', 'main']})]
};
