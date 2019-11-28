require('@babel/register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
});
require('regenerator-runtime/runtime');
// require("core-js/stable");
require('./src/index.ts');
