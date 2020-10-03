'use strict'

var visit = require('unist-util-visit')

module.exports = compact

// Make an mdast tree compact by merging adjacent text nodes.
function compact(tree) {
  visit(tree, visitor)

  return tree

  function visitor(child, index, parent) {
    var siblings = parent ? parent.children : []
    var previous = index && siblings[index - 1]

    if (
      previous &&
      child.type === previous.type &&
      (child.type === 'text' || child.type === 'blockquote')
    ) {
      if (child.value) {
        previous.value += child.value
      }

      if (child.children) {
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
