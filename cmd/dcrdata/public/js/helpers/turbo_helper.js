/* global Turbo */
import Url from 'url-parse'

export default class TurboQuery extends Turbo {
  constructor () {
    super()
    const tq = this
    tq.url = Url(window.location.href, true)
  }

  toHref () {
    this.visit(this.url.href)
  }

  replace (query) {
    this.url.set('query', this.filteredQuery(query))
    this.visit(this.url.href, { action: 'replace' })
  }

  to (query) {
    this.url.set('query', this.filteredQuery(query))
    this.toHref()
  }

  filteredQuery (query) {
    const filtered = {}
    Object.keys(query).forEach(function (key) {
      const v = query[key]
      if (typeof v === 'undefined' || v === null) return
      filtered[key] = v
    })
    return filtered
  }

  update (target) {
    // Update projects the current query parameters onto the given template.
    return this.constructor.project(target, this.parsed)
  }

  get parsed () {
    return this.url.query
  }

  // Not an ES5 getter.
  get (key) {
    if (Object.prototype.hasOwnProperty.call(this.url.query, key)) {
      return TurboQuery.parseValue(this.url.query[key])
    }
    return null
  }

  static parseValue (v) {
    switch (v) {
      case 'null':
        return null
      case '':
        return null
      case 'undefined':
        return null
      case 'false':
        return false
      case 'true':
        return true
    }
    if (!isNaN(parseFloat(v)) && isFinite(v)) {
      if (String(v).includes('.')) {
        return parseFloat(v)
      } else {
        return parseInt(v)
      }
    }
    return v
  }

  static project (target, source) {
    // project fills in the properties of the given template, if they exist in
    // the source. Extraneous source properties are not added to the template.
    const keys = Object.keys(target)
    let idx
    for (idx in keys) {
      const k = keys[idx]
      if (Object.prototype.hasOwnProperty.call(source, k)) {
        target[k] = this.parseValue(source[k])
      }
    }
    return target
  }

  static nullTemplate (keys) {
    const d = {}
    keys.forEach((key) => {
      d[key] = null
    })
    return d
  }
}
