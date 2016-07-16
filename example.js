// Dependencies:
var u = require('unist-builder');
var compact = require('./index.js');

// Tree:
var tree = u('strong', [
  u('text', 'alpha'),
  u('text', ' '),
  u('text', 'bravo')
]);

// Compact:
compact(tree);

// `tree` now yields:
console.log('js', require('util').inspect(tree, {depth: null}));
