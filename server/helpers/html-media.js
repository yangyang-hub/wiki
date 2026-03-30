const _ = require('lodash')
const cheerio = require('cheerio')
const basePathHelper = require('./basepath')

function rewriteMediaUrls ($, basePath) {
  const rewriteLocalAssetAttr = (elm, attrName) => {
    const attrValue = $(elm).attr(attrName)
    if (!_.isString(attrValue) || _.isEmpty(attrValue)) {
      return
    }
    $(elm).attr(attrName, basePathHelper.withBasePathIfLocal(basePath, attrValue))
  }

  $('img, source, video, audio, iframe, embed').each((i, elm) => {
    ;['src', 'data-src', 'lazy-src', 'poster'].forEach(attrName => rewriteLocalAssetAttr(elm, attrName))

    const srcset = $(elm).attr('srcset')
    if (_.isString(srcset) && !_.isEmpty(srcset)) {
      const rewrittenSrcset = srcset
        .split(',')
        .map(entry => {
          const trimmedEntry = _.trim(entry)
          if (_.isEmpty(trimmedEntry)) {
            return trimmedEntry
          }

          const parts = trimmedEntry.split(/\s+/)
          parts[0] = basePathHelper.withBasePathIfLocal(basePath, parts[0])
          return parts.join(' ')
        })
        .join(', ')

      $(elm).attr('srcset', rewrittenSrcset)
    }
  })

  $('object').each((i, elm) => {
    rewriteLocalAssetAttr(elm, 'data')
  })

  $('a').each((i, elm) => {
    rewriteLocalAssetAttr(elm, 'href')
  })

  $('form').each((i, elm) => {
    rewriteLocalAssetAttr(elm, 'action')
  })
}

function rewriteHtmlMediaUrls (html, basePath) {
  if (!_.isString(html) || _.isEmpty(html)) {
    return html
  }

  const $ = cheerio.load(html, {
    decodeEntities: true
  })

  rewriteMediaUrls($, basePath)

  return $.root().html()
}

module.exports = {
  rewriteMediaUrls,
  rewriteHtmlMediaUrls
}
