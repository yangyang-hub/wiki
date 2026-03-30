const _ = require('lodash')

function normalizeBasePath (basePath = '') {
  if (!_.isString(basePath)) {
    return ''
  }

  let normalized = _.trim(basePath)
  if (_.isEmpty(normalized) || normalized === '/') {
    return ''
  }

  if (!_.startsWith(normalized, '/')) {
    normalized = `/${normalized}`
  }

  normalized = normalized.replace(/\/+$/, '')

  return normalized === '/' ? '' : normalized
}

function withBasePath (basePath, targetPath = '/') {
  const normalizedBasePath = normalizeBasePath(basePath)
  const normalizedTargetPath = _.startsWith(targetPath, '/') ? targetPath : `/${targetPath}`

  if (_.isEmpty(normalizedBasePath)) {
    return normalizedTargetPath
  }
  if (normalizedTargetPath === '/') {
    return `${normalizedBasePath}/`
  }

  return `${normalizedBasePath}${normalizedTargetPath}`
}

function withSiteUrl (host = '', basePath = '', targetPath = '/') {
  const normalizedHost = _.trimEnd(host || '', '/')
  return `${normalizedHost}${withBasePath(basePath, targetPath)}`
}

function withBasePathIfLocal (basePath, targetPath = '/') {
  if (!_.isString(targetPath) || _.isEmpty(targetPath)) {
    return withBasePath(basePath, '/')
  }
  if (/^[a-z]+:\/\//i.test(targetPath) || _.startsWith(targetPath, '//')) {
    return targetPath
  }

  const normalizedBasePath = normalizeBasePath(basePath)
  if (!_.isEmpty(normalizedBasePath) && (targetPath === normalizedBasePath || _.startsWith(targetPath, `${normalizedBasePath}/`))) {
    return targetPath
  }

  if (_.startsWith(targetPath, '/')) {
    return withBasePath(basePath, targetPath)
  }

  return targetPath
}

module.exports = {
  normalizeBasePath,
  withBasePath,
  withSiteUrl,
  withBasePathIfLocal
}
