/**
 * @typedef {import('mdast').Content|import('mdast').Root} MdastNode
 */

import {visit} from 'unist-util-visit'

/**
 * Make an mdast tree compact by merging adjacent text nodes and block quotes.
 *
 * @template {MdastNode} Tree
 * @param {Tree} tree
 * @returns {Tree}
 */
export function compact(tree) {
  visit(tree, (child, index, parent) => {
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
  })

  return tree
}
