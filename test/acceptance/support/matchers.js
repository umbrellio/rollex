export default {
  toDisplayDigits (util, customEqualityTesters) {
    return {
      compare (object, expected) {
        const actual = Array.prototype.slice.call(object.querySelectorAll('span'))
          .filter((el) => isVisible(el))
          .map((el) => el.textContent)
          .join('')
        const pass = util.equals(actual, expected, customEqualityTesters)

        if (pass) {
          var message = `Expected ${object} not to display ${expected}`
        } else {
          var message = `Expected ${object} to display ${expected}, but it displayed ${actual}`
        }

        return { pass, message }
      }
    }
  },
  toHaveLabels (util, customEqualityTesters) {
    return {
      compare (object, expected) {
        const actual = Array.prototype.slice.call(object.querySelectorAll('.rollex-label'))
          .map((el) => el.textContent)
        const pass = util.equals(actual, expected, customEqualityTesters)

        if (pass) {
          var message = `Expected ${object} not to have labels: ${expected}`
        } else {
          var message = `Expected ${object} to have labels: ${expected}, but got: ${actual}`
        }

        return { pass, message }
      }
    }
  }
}

/**
 * A proper function to check if the DOM element is visible.
 * @param {Element} element
 * @return {boolean} visible
 */
function isVisible (element) {
  if (element.offsetWidth === 0 || element.offsetHeight === 0) return false

  const height = document.documentElement.clientHeight
  const rects = element.getClientRects()

  function onTop (rect) {
    for (let x = Math.floor(rect.left); x <= Math.ceil(rect.right); x++) {
      for (let y = Math.floor(rect.top); y <= Math.ceil(rect.bottom); y++) {
        if (document.elementFromPoint(x, y) === element) return true
      }
    }
    return false
  }

  for (let rect of rects) {
    const inViewport = rect.top > 0 ? rect.top <= height : (rect.bottom > 0 && rect.bottom <= height)
    if (inViewport && onTop(rect)) return true
  }
  return false
}
