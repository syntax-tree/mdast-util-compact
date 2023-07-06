import assert from 'node:assert/strict'
import test from 'node:test'
import {u} from 'unist-builder'
import {compact} from './index.js'

test('compact', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'compact'
    ])
  })

  await t.test('should compact texts', async function () {
    const tree = u('paragraph', [
      u('text', 'alpha'),
      u('text', ' '),
      u('text', 'bravo')
    ])

    compact(tree)

    assert.deepEqual(tree, u('paragraph', [u('text', 'alpha bravo')]))
  })

  await t.test('should merge positions', async function () {
    const tree = u('paragraph', [
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
        {
          position: {
            start: {line: 1, column: 7},
            end: {line: 1, column: 12}
          }
        },
        'bravo'
      )
    ])

    compact(tree)

    assert.deepEqual(
      tree,
      u('paragraph', [
        u(
          'text',
          {position: {start: {line: 1, column: 1}, end: {line: 1, column: 12}}},
          'alpha bravo'
        )
      ])
    )
  })

  await t.test(
    'should compact texts with incompatible positions',
    async function () {
      const tree = u('paragraph', [
        u('text', 'at'),
        u(
          'text',
          {
            position: {
              start: {line: 1, column: 3},
              end: {line: 1, column: 8}
            }
          },
          '&'
        ),
        u('text', 't')
      ])

      compact(tree)

      assert.deepEqual(tree, u('paragraph', [u('text', 'at&t')]))
    }
  )

  await t.test('should compact blockquotes', async function () {
    const tree = u('root', [
      u('blockquote', [u('paragraph', [u('text', 'Alpha.')])]),
      u('blockquote', [u('paragraph', [u('text', 'Bravo.')])])
    ])

    compact(tree)

    assert.deepEqual(
      tree,
      u('root', [
        u('blockquote', [
          u('paragraph', [u('text', 'Alpha.')]),
          u('paragraph', [u('text', 'Bravo.')])
        ])
      ])
    )
  })
})
