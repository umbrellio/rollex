export default {
  toDisplayDigits (util, customEqualityTesters) {
    return {
      compare (object, expected) {
        const actual = getChildrenTextContents(object, 'span', true).join('')
        const pass = util.equals(actual, expected, customEqualityTesters)

        let message
        if (pass) {
          message = `Expected ${object} not to display ${expected}`
        } else {
          message = `Expected ${object} to display ${expected}, but it displayed ${actual}`
        }

        return { pass, message }
      },
    }
  },
  toHaveLabels (util, customEqualityTesters) {
    return {
      compare (object, expected) {
        const actual = getChildrenTextContents(object, '.rollex-label')
        const pass = util.equals(actual, expected, customEqualityTesters)

        let message
        if (pass) {
          message = `Expected ${object} not to have labels: ${expected}`
        } else {
          message = `Expected ${object} to have labels: ${expected}, but got: ${actual}`
        }

        return { pass, message }
      },
    }
  },
  toHaveSeparators (util, customEqualityTesters) {
    return {
      compare (object, expected) {
        const actual = getChildrenTextContents(object, '.rollex-separator')
        const pass = util.equals(actual, expected, customEqualityTesters)

        let message
        if (pass) {
          message = `Expected ${object} not to have separators: ${expected}`
        } else {
          message = `Expected ${object} to have separators: ${expected}, but got: ${actual}`
        }

        return { pass, message }
      },
    }
  },
}

/**
 * Gets text contents of children with given selector.
 * @param {!Element} object
 * @param {!string} selector
 * @param {?boolean} onlyVisible - if true, will only return text contents of visible children
 * @return {string[]} text contents
 */
function getChildrenTextContents (object, selector, onlyVisible = false) {
  let children = Array.prototype.slice.call(object.querySelectorAll(selector))
  if (onlyVisible) children = children.filter(el => isVisible(el))
  return children.map(el => el.textContent)
}

/**
 * A proper function to check if the DOM element is visible.
 * @param {Element} element
 * @return {boolean} visible
 */
function isVisible (element) {
  // Does element have non-zero dimensions?
  if (
    element.offsetWidth +
      element.offsetHeight +
      element.getBoundingClientRect().height +
      element.getBoundingClientRect().width ===
    0
  ) {
    return false
  }

  // Is the element on the screen?
  const elementCenter = {
    x: element.getBoundingClientRect().left + element.offsetWidth / 2,
    y: element.getBoundingClientRect().top + element.offsetHeight / 2,
  }
  if (elementCenter.x < 0) return false
  if (
    elementCenter.x >
    (document.documentElement.clientWidth || window.innerWidth)
  ) {
    return false
  }
  if (elementCenter.y < 0) return false
  if (
    elementCenter.y >
    (document.documentElement.clientHeight || window.innerHeight)
  ) {
    return false
  }

  // Try to "hit" our element while traversing its parents
  let pointContainer = document.elementFromPoint(
    elementCenter.x,
    elementCenter.y
  )
  do {
    if (pointContainer === element) return true
  } while ((pointContainer = pointContainer.parentNode)) // eslint-disable-line no-cond-assign
  return false
}
