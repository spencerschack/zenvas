const Funnel = require('broccoli-funnel');
const Concat = require('broccoli-concat');
const MergeTrees = require('broccoli-merge-trees');
const JSTranspiler = require('broccoli-babel-transpiler');
const BroccoliLivereload = require('broccoli-livereload');

const index = new BroccoliLivereload('src', {
  target: 'index.html'
});

const js = new JSTranspiler('src', {

  plugins: [
    'transform-class-properties',
    'transform-function-bind',
    'transform-es2015-modules-amd'
  ],

  presets: [
    'es2015'
  ],

  moduleIds: true

});

const packages = new Funnel('node_modules/requirejs', {
  files: ['require.js']
});

const scripts = new Concat(new MergeTrees([js, packages]), {

  inputFiles: [
    '**/*.js'
  ],

  outputFile: '/script.js',

  headerFiles: ['require.js'],

  footer: "require(['main'], function(main) { main.default(); });"

});

module.exports = new MergeTrees([scripts, index]);
