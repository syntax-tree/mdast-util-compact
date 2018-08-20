'use strict'

var visit = require('unist-util-visit')
var modify = require('unist-util-modify-children')

module.exports = compact

/* Make an MDAST tree compact by merging adjacent text nodes. */
function compact(tree, commonmark) {
  var modifier = modify(iterator)

  visit(tree, visitor)

  return tree

  function visitor(node) {
    if (node.children) {
      modifier(node)
    }
  }

  function iterator(child, index, parent) {
    var siblings = parent.children
    var prev = index && siblings[index - 1]

    if (
      prev &&
      child.type === prev.type &&
      mergeable(prev, commonmark) &&
      mergeable(child, commonmark)
    ) {
      if (child.value) {
        prev.value += child.value
      }

      if (child.children) {
        prev.children = prev.children.concat(child.children)
      }

      siblings.splice(index, 1)

      if (prev.position && child.position) {
        prev.position.end = child.position.end
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

    /* Only merge nodes which occupy the same size as their `value`. */
    return (
      start.line !== end.line || end.column - start.column === node.value.length
    )
  }

  return commonmark && node.type === 'blockquote'
}
