/**
 * Webpack Plugin for inject some information in js / html
 * @author 余聪
 */

const fs = require('fs')
const template = require('lodash.template')
const { constantCase } = require('change-case')
const { RawSource } = require('webpack').sources || require('webpack-sources')

const isJsFile = (name) => /\.(js)$/i.test(name)
const isHtmlFile = (name) => /\.(html|htm)$/i.test(name)

const stringify = JSON.stringify

const generateScript = (name, info) => {
  return `;(function () {
if (typeof window !== 'undefined' && !window[${stringify(name)}]) {
    window[${stringify(name)}] = ${stringify(info)};
}
})();`
}

const generateInsertText = ({ filename, content }, name, info) => {
  const text = generateScript(name, info)
  if (content.includes(text)) {
    return content
  }
  if (isJsFile(filename)) {
    return text + '\n' + content
  }
  if (isHtmlFile(filename)) {
    return content.replace(/<\/head>/i, (_) => `<script>${text}</script>${_}`)
  }
  return content
}

const pluginName = 'InjectInfoPlugin'

class InjectInfoPlugin {
  constructor(info, name = '__INJECTED_INFO_${name}__') {
    this.info = info
    this.name = name
  }
  apply(compiler) {
    const name = template(this.name)({ name: constantCase(compiler.options.name || '') })

    compiler.hooks.emit.tapAsync(pluginName, async (compilation, cb) => {
      const infoData = typeof this.info === 'function' ? await this.info(compilation) : this.info
      for (const [filename, prevSource] of Object.entries(compilation.assets)) {
        if (isJsFile(filename) || isHtmlFile(filename)) {
          compilation.assets[filename] = new RawSource(
            generateInsertText({ filename, content: prevSource.source() }, name, infoData)
          )
        }
      }

      cb()
    })
  }
}

module.exports = InjectInfoPlugin
