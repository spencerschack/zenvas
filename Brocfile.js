const funnel = require('broccoli-funnel');
const concat = require('broccoli-concat');
const mergeTrees = require('broccoli-merge-trees');
const esTranspiler = require('broccoli-babel-transpiler');

const src = 'src';

const indexHtml = funnel(src, {
  files: ['index.html']
});

const js = esTranspiler(src, {

  plugins: [
    'transform-class-properties',
    'transform-function-bind',
    'transform-es2015-modules-amd'
  ],
  presets: [
    'es2015'
  ],

  moduleIds: true,

  // Transforms /index.js files to use their containing directory name
  getModuleId: function (name) {
    return name.replace(/\/index$/, '');
  },

  // Fix relative imports inside /index's
  resolveModuleSource: function (source, filename) {
    var match = filename.match(/(.+)\/index\.\S+$/i);

    // is this an import inside an /index file?
    if (match) {
      var path = match[1];
      return source
        .replace(/^\.\//, path + '/')
        .replace(/^\.\.\//, '');
    } else {
      return source;
    }
  }
});

const main = concat(js, {
  inputFiles: [
    '**/*.js'
  ],
  outputFile: '/script.js'
});

module.exports = mergeTrees([main, indexHtml]);
