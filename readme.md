# mdast-util-compact [![Build][build-badge]][build] [![Coverage][coverage-badge]][coverage] [![Downloads][downloads-badge]][downloads] [![Chat][chat-badge]][chat]

Make [mdast][] trees compact: collapse text nodes (when possible),
and blockquotes (in commonmark mode).

## Installation

[npm][]:

```bash
npm install mdast-util-compact
```

## Usage

```javascript
var u = require('unist-builder')
var compact = require('mdast-util-compact')

var tree = u('strong', [u('text', 'alpha'), u('text', ' '), u('text', 'bravo')])

compact(tree)

console.log(tree)
```

Yields:

```js
{ type: 'strong',
  children: [ { type: 'text', value: 'alpha bravo' } ] }
```

## API

### `compact(tree[, commonmark])`

Visit the tree and collapse nodes.  Combines adjacent text nodes (but
not when they represent entities or escapes).  If `commonmark` is `true`,
collapses `blockquote` nodes.

Handles positional information properly.

###### Returns

The given `tree`.

## Contribute

See [`contributing.md` in `syntax-tree/mdast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/mdast-util-compact.svg

[build]: https://travis-ci.org/syntax-tree/mdast-util-compact

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-compact.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-compact

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-compact.svg

[downloads]: https://www.npmjs.com/package/mdast-util-compact

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[contributing]: https://github.com/syntax-tree/mdast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/mdast/blob/master/code-of-conduct.md
