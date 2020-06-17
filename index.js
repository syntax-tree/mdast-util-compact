'use strict'

var visit = require('unist-util-visit')

module.exports = compact

// Make an mdast tree compact by merging adjacent text nodes.
function compact(tree, commonmark) {
  visit(tree, visitor)

  return tree

  function visitor(child, index, parent) {
    var siblings = parent ? parent.children : []
    var previous = index && siblings[index - 1]

    if (
      previous &&
      child.type === previous.type &&
      mergeable(previous, commonmark) &&
      mergeable(child, commonmark)
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

function mergeable(node, commonmark) {
  var start
  var end

  if (node.type === 'text') {
    if (!node.position) {
      return true
    }

    start = node.position.start
    end = node.position.end

    // Only merge nodes which occupy the same size as their `value`.
    return (
      start.line !== end.line || end.column - start.column === node.value.length
    )
  }

  return commonmark && node.type === 'blockquote'
}
