const pug = require('pug')
const _ = require('lodash')
const parsetrace = require('parsetrace')
const openInEditor = require('express-open-in-editor')

const entries = (obj) => _.transform(obj, (acc, value, key) => {
  acc.push({ key, value: JSON.stringify(value) })
}, [])

const pickRequestKeys = (obj) => _.pick(obj, [
  'url',
  'method',
  'statusCode',
  'statusMessage',
  'params',
  'query'
])

const pickAppKeys = (obj) => _.pick(obj, [
  'mountpath',
  'cache',
  'engines'
])

function middleware (app, options = {}) {
  const opts = _.defaultsDeep({}, options, {
    stackTraceOptions: {
      sources: true,
      strict: true,
      contextSize: 3
    },
    editorOptions: {}
  })

  app.use(openInEditor(opts.editorOptions))

  return function middleware (err, req, res, next) {
    const compiledErrorTemplate = pug.compileFile('./template/error.pug', {
      inlineRuntimeFunctions: true
    })

    const parsedStackTrace = parsetrace(err, opts.stackTraceOptions)

    const template = compiledErrorTemplate({
      rawError: err,
      error: parsedStackTrace.object(),
      requestContext: entries(pickRequestKeys(req)),
      appContext: entries(pickAppKeys(app)),
      fileSource: parsedStackTrace.object().frames[0].source
    })

    res
      .status(500)
      .send(template)
  }
}

module.exports = middleware
