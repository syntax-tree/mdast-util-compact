/**
 * @typedef {import('mdast').Content|import('mdast').Root} Node
 */

import {visit} from 'unist-util-visit'

/**
 * Make an mdast tree compact by merging adjacent text nodes and block quotes.
 *
 * @template {Node} Tree
 * @param {Tree} tree
 * @returns {Tree}
 */
export function compact(tree) {
  // @ts-expect-error: hush, TS.
  visit(tree, visitor)

  return tree

  /**
   * @param {import('mdast').Content} child
   * @param {number} index
   * @param {Extract<Node, import('mdast').Parent>} parent
   */
  function visitor(child, index, parent) {
    if (
      parent &&
      index &&
      (child.type === 'text' || child.type === 'blockquote')
    ) {
      const previous = parent.children[index - 1]

      if (previous.type === child.type) {
        if ('value' in child) {
          // @ts-expect-error `previous` has the same type as `child`.
          previous.value += child.value
        }

        if ('children' in child) {
          // @ts-expect-error `previous` has the same type as `child`.
          previous.children = previous.children.concat(child.children)
        }

        parent.children.splice(index, 1)

        if (previous.position && child.position) {
          previous.position.end = child.position.end
        }

        return index
      }
    }
  }
}
