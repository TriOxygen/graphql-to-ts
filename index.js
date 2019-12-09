require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
});
require('regenerator-runtime/runtime');
require('./src/run.ts');
