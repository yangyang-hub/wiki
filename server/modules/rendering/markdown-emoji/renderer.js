const { full: mdEmoji } = require('markdown-it-emoji')
const twemoji = require('twemoji')
const basePathHelper = require('../../../helpers/basepath')

/* global WIKI */

// ------------------------------------
// Markdown - Emoji
// ------------------------------------

module.exports = {
  init (md, conf) {
    md.use(mdEmoji)

    md.renderer.rules.emoji = (token, idx) => {
      return twemoji.parse(token[idx].content, {
        callback (icon, opts) {
          return basePathHelper.withBasePath(WIKI.config.basePath, `/_assets/svg/twemoji/${icon}.svg`)
        }
      })
    }
  }
}
