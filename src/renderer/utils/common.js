import creditCardType from 'credit-card-type'
import parse5 from 'parse5'

export function detectCardBrand (cardNumber) {
  if (!cardNumber) {
    return null
  }
  const card = creditCardType(cardNumber)
  return card[0]?.niceType || null
}

export function getTagFromHtml (htmlString, tag) {
  const document = parse5.parse(htmlString)

  function findFirstTag (node) {
    if (node.tagName === tag) {
      return node
    }

    if (node.childNodes) {
      for (const childNode of node.childNodes) {
        const n = findFirstTag(childNode)
        if (n) {
          return n
        }
      }
    }

    return null
  }

  return findFirstTag(document)
}

export function getTextFromPTag (paragraphElement) {
  let text = ''

  // Traverse all child nodes of the paragraph element
  for (const node of paragraphElement.childNodes) {
    if (node.nodeName === '#text') {
      // For text nodes, add their content to the result
      text += node.value
    } else {
      // For element nodes, recursively get their text content
      text += getTextFromPTag(node)
    }
  }

  return text
}
