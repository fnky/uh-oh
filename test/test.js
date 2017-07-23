import test from 'ava'
import request from 'supertest'
import td from 'testdouble'
import createErrorHandler from '../'
import realApp from './fixtures/app'

let middleware
let app
let req
let res
let error

test.beforeEach(t => {
  app = td.object()
  app.use = td.function()
  req = td.object()
  req.headers = td.object()
  res = td.object()
  res.status = td.function()
  res.send = td.function()
  res.end = td.function()
  error = td.function()

  middleware = createErrorHandler(app, {
    stackTraceOptions: {
      strict: false
    }
  })
})

test.afterEach(t => {
  td.reset()
})

test('returns a middleware', t => {
  t.is(typeof middleware, 'function')
})

test('calls req.status and req.send', t => {
  td.when(res.status(500)).thenReturn(res)
  td.when(res.send()).thenReturn(true)
  td.when(error('oops')).thenReturn(new Error('Oompaloempa'))

  middleware(error('oops'), req, res)

  t.deepEqual(res.status(500), res)
  t.is(res.send(), true)
})

test('responds with 500 and content', async t => {
  const response = await request(realApp)
    .get('/')
    .expect('Content-Type', /text\/html/)
    .expect(500)

  t.is(response.status, 500)
})
