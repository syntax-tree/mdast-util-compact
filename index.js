/**
 * @typedef {import('unist').Node} Node
 * @typedef {import('unist-util-visit').Visitor<Node>} Visitor
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

  /** @type {Visitor} */
  function visitor(child, index, parent) {
    var siblings = parent ? parent.children : []
    var previous = index && siblings[index - 1]

    if (
      previous &&
      child.type === previous.type &&
      (child.type === 'text' || child.type === 'blockquote')
    ) {
      if (child.value) {
        // @ts-ignore must be text.
        previous.value += child.value
      }

      if (child.children) {
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
