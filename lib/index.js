/**
 * @typedef {import('mdast').Nodes} Nodes
 */

import {ok as assert} from 'devlop'
import {visit} from 'unist-util-visit'

/**
 * Make an mdast tree compact by merging adjacent text nodes and block quotes.
 *
 * @param {Nodes} tree
 *   Tree to change.
 * @returns {undefined}
 *   Nothing.
 */
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
}
