/**
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').Root} Root
 */

// To do: when `mdast` is released, use `Nodes`.
/**
 * @typedef {Content | Root} Node
 */

import {ok as assert} from 'devlop'
import {visit} from 'unist-util-visit'

/**
 * Make an mdast tree compact by merging adjacent text nodes and block quotes.
 *
 * @template {Node} Tree
 *   Node type.
 * @param {Tree} tree
 *   Tree to change.
 * @returns {Tree}
 *   Changed tree.
 */
// To do: next major: don‘t return `tree`.
export function compact(tree) {
  visit(tree, function (child, index, parent) {
    if (
      parent &&
      index &&
      (child.type === 'text' || child.type === 'blockquote')
    ) {
      const previous = parent.children[index - 1]

      if (previous.type === child.type) {
        if ('value' in child) {
          assert('value' in previous, 'same type')
          previous.value += child.value
        }

        if ('children' in child) {
          assert('children' in previous, 'same type')
          previous.children = previous.children.concat(child.children)
        }

        parent.children.splice(index, 1)

        if (previous.position && child.position) {
          previous.position.end = child.position.end
        }

        return index
      }
    }
  })

  return tree
}
