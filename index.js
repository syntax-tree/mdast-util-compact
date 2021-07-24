/**
 * @typedef {import('mdast').Content} Node
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
  visit(tree, visitor)

  return tree

  /** @type {import('unist-util-visit').Visitor<Node>} */
  function visitor(child, index, parent) {
    const siblings = parent ? parent.children : []
    const previous = index && siblings[index - 1]

    if (
      (child.type === 'text' || child.type === 'blockquote') &&
      previous &&
      child.type === previous.type
    ) {
      if ('value' in child) {
        // @ts-ignore must be text.
        previous.value += child.value
      }

      if ('children' in child) {
        // @ts-ignore must be block quote.
        previous.children = previous.children.concat(child.children)
      }

      siblings.splice(index, 1)

      if (previous.position && child.position) {
        previous.position.end = child.position.end
      }

      return index
    }
  }
}
