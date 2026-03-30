require('core-js/stable')
require('regenerator-runtime/runtime')

/* global siteConfig, __webpack_public_path__ */
/* eslint-disable no-unused-expressions */

siteConfig.assetBasePath = siteConfig.assetBasePath || `${siteConfig.basePath || ''}/_assets`
__webpack_public_path__ = `${siteConfig.assetBasePath}/`

require('./scss/app.scss')
import(/* webpackChunkName: "mdi" */ '@mdi/font/css/materialdesignicons.css')

require('./helpers/compatibility.js')

require('./client-setup.js')
