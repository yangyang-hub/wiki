import filesize from 'filesize.js'
import _ from 'lodash'

/* global siteConfig */

const helpers = {
  withBasePath (rawPath = '/') {
    let targetPath = rawPath
    if (!_.startsWith(targetPath, '/')) {
      targetPath = `/${targetPath}`
    }
    if (!siteConfig.basePath) {
      return targetPath
    }
    if (targetPath === '/') {
      return `${siteConfig.basePath}/`
    }
    return `${siteConfig.basePath}${targetPath}`
  },
  withAssetPath (rawPath = '/') {
    return helpers.withBasePath(`/_assets/${_.trimStart(rawPath, '/')}`)
  },
  withBasePathIfLocal (rawPath = '/') {
    if (_.isNil(rawPath) || rawPath === '') {
      return helpers.withBasePath('/')
    }
    if (/^(?:[a-z]+:)?\/\//i.test(rawPath) || _.startsWith(rawPath, 'data:') || _.startsWith(rawPath, 'mailto:') || _.startsWith(rawPath, 'tel:')) {
      return rawPath
    }
    if (_.startsWith(rawPath, '#')) {
      return rawPath
    }
    if (_.startsWith(rawPath, '/')) {
      return helpers.withBasePath(rawPath)
    }
    return rawPath
  },
  cookiePath () {
    return siteConfig.basePath || '/'
  },
  cookieOptions (extra = {}) {
    return {
      path: helpers.cookiePath(),
      ...extra
    }
  },
  /**
   * Convert bytes to humanized form
   * @param {number} rawSize Size in bytes
   * @returns {string} Humanized file size
   */
  filesize (rawSize) {
    return _.toUpper(filesize(rawSize))
  },
  /**
   * Convert raw path to safe path
   * @param {string} rawPath Raw path
   * @returns {string} Safe path
   */
  makeSafePath (rawPath) {
    let rawParts = _.split(_.trim(rawPath), '/')
    rawParts = _.map(rawParts, (r) => {
      return _.kebabCase(_.deburr(_.trim(r)))
    })

    return _.join(_.filter(rawParts, (r) => { return !_.isEmpty(r) }), '/')
  },
  resolvePath (path) {
    if (_.startsWith(path, '/')) { path = path.substring(1) }
    return `${siteConfig.path}${path}`
  },
  /**
   * Set Input Selection
   * @param {DOMElement} input The input element
   * @param {number} startPos The starting position
   * @param {nunber} endPos The ending position
   */
  setInputSelection (input, startPos, endPos) {
    input.focus()
    if (typeof input.selectionStart !== 'undefined') {
      input.selectionStart = startPos
      input.selectionEnd = endPos
    } else if (document.selection && document.selection.createRange) {
      // IE branch
      input.select()
      var range = document.selection.createRange()
      range.collapse(true)
      range.moveEnd('character', endPos)
      range.moveStart('character', startPos)
      range.select()
    }
  }
}

export default {
  install(Vue) {
    Vue.$helpers = helpers
    Object.defineProperties(Vue.prototype, {
      $helpers: {
        get() {
          return helpers
        }
      }
    })
  }
}
