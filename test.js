'use strict'

var test = require('tape')
var u = require('unist-builder')
var compact = require('.')

test('compact()', function(t) {
  t.same(
    compact(
      u('paragraph', [u('text', 'alpha'), u('text', ' '), u('text', 'bravo')])
    ),
    u('paragraph', [u('text', 'alpha bravo')]),
    'should compact texts'
  )

  t.same(
    compact(
      u('paragraph', [
        u(
          'text',
          {
            position: {start: {line: 1, column: 1}, end: {line: 1, column: 6}}
          },
          'alpha'
        ),
        u(
          'text',
          {
            position: {start: {line: 1, column: 6}, end: {line: 1, column: 7}}
          },
          ' '
        ),
        u(
          'text',
          {
            position: {start: {line: 1, column: 7}, end: {line: 1, column: 12}}
          },
          'bravo'
        )
      ])
    ),
    u('paragraph', [
      u(
        'text',
        {
          position: {start: {line: 1, column: 1}, end: {line: 1, column: 12}}
        },
        'alpha bravo'
      )
    ]),
    'should merge positions'
  )

  t.same(
    compact(
      u('paragraph', [
        u('text', 'at'),
        u(
          'text',
          {
            position: {start: {line: 1, column: 3}, end: {line: 1, column: 8}}
          },
          '&'
        ),
        u('text', 't')
      ])
    ),
    u('paragraph', [
      u('text', 'at'),
      u(
        'text',
        {
          position: {start: {line: 1, column: 3}, end: {line: 1, column: 8}}
        },
        '&'
      ),
      u('text', 't')
    ]),
    'should not compact texts with incompatible positions'
  )

  t.same(
    compact(
      u('root', [
        u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
        u('blockquote', [u('paragraph', [u('text', 'Bravo.')])])
      ])
    ),
    u('root', [
      u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
      u('blockquote', [u('paragraph', [u('text', 'Bravo.')])])
    ]),
    'should not compact blockquotes'
  )

  t.same(
    compact(
      u('root', [
        u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
        u('blockquote', [u('paragraph', [u('text', 'Bravo.')])])
      ]),
      true
    ),
    u('root', [
      u('blockquote', [
        u('paragraph', [u('text', 'Alpha.')]),
        u('paragraph', [u('text', 'Bravo.')])
      ])
    ]),
    'should compact blockquotes in commonmark mode'
  )

  t.end()
})
