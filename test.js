import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {compact} from './index.js'
import * as mod from './index.js'

test('compact', () => {
  assert.deepEqual(
    Object.keys(mod).sort(),
    ['compact'],
    'should expose the public api'
  )

  assert.deepEqual(
    compact(
      u('paragraph', [u('text', 'alpha'), u('text', ' '), u('text', 'bravo')])
    ),
    u('paragraph', [u('text', 'alpha bravo')]),
    'should compact texts'
  )

  assert.deepEqual(
    compact(
      u('paragraph', [
        u(
          'text',
          {position: {start: {line: 1, column: 1}, end: {line: 1, column: 6}}},
          'alpha'
        ),
        u(
          'text',
          {position: {start: {line: 1, column: 6}, end: {line: 1, column: 7}}},
          ' '
        ),
        u(
          'text',
          {position: {start: {line: 1, column: 7}, end: {line: 1, column: 12}}},
          'bravo'
        )
      ])
    ),
    u('paragraph', [
      u(
        'text',
        {position: {start: {line: 1, column: 1}, end: {line: 1, column: 12}}},
        'alpha bravo'
      )
    ]),
    'should merge positions'
  )

  assert.deepEqual(
    compact(
      u('paragraph', [
        u('text', 'at'),
        u(
          'text',
          {position: {start: {line: 1, column: 3}, end: {line: 1, column: 8}}},
          '&'
        ),
        u('text', 't')
      ])
    ),
    u('paragraph', [u('text', 'at&t')]),
    'should compact texts with incompatible positions'
  )

  assert.deepEqual(
    compact(
      u('root', [
        u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
        u('blockquote', [u('paragraph', [u('text', 'Bravo.')])])
      ])
    ),
    u('root', [
      u('blockquote', [
        u('paragraph', [u('text', 'Alpha.')]),
        u('paragraph', [u('text', 'Bravo.')])
      ])
    ]),
    'should compact blockquotes'
  )
})
