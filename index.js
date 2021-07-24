/**
 * @typedef {import('mdast').Content|import('mdast').Root} Node
 */

import {visit} from 'unist-util-visit'

/**
 * Make an mdast tree compact by merging adjacent text nodes.
 *
 * @template {Node} T
 * @param {T} tree
 * @returns {T}
 */
export function compact(tree) {
  visit(
    tree,
    /** @type {import('unist-util-visit').Visitor<Node>} */
    // @ts-expect-error: fine.
    (child, index, parent) => {
      if (
        parent &&
        index &&
        (child.type === 'text' || child.type === 'blockquote') &&
        child.type === parent.children[index - 1].type
      ) {
        const previous = parent.children[index - 1]

        if ('value' in child) {
          // @ts-expect-error must be text.
          previous.value += child.value
        }

        if ('children' in child) {
          // @ts-expect-error must be block quote.
          previous.children = previous.children.concat(child.children)
        }

        parent.children.splice(index, 1)

        if (previous.position && child.position) {
          previous.position.end = child.position.end
        }

        return index
      }
    }
  )

  return tree
}
