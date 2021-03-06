'use strict'

const path = require('path')
const fs = require('fs')

const t = require('tap')
const request = require('request')

const fastifyStatic = require('../')

const indexContent = fs.readFileSync('./test/static/index.html').toString('utf8')
const deepContent = fs.readFileSync('./test/static/deep/path/for/test/purpose/foo.html').toString('utf8')
const innerIndex = fs.readFileSync('./test/static/deep/path/for/test/index.html').toString('utf8')

const body403 = fs.readFileSync('./static/403.html').toString('utf8')
const body404 = fs.readFileSync('./static/404.html').toString('utf8')

const GENERIC_RESPONSE_CHECK_COUNT = 5
function genericResponseChecks (t, response) {
  t.ok(/text\/(html|css)/.test(response.headers['content-type']))
  t.ok(response.headers.etag)
  t.ok(response.headers['last-modified'])
  t.ok(response.headers.date)
  t.ok(response.headers['cache-control'])
}

t.test('register /static', t => {
  t.plan(9)

  const pluginOptions = {
    root: path.join(__dirname, '/static'),
    prefix: '/static'
  }
  const fastify = require('fastify')()
  fastify.register(fastifyStatic, pluginOptions)

  fastify.listen(0, err => {
    t.error(err)

    fastify.server.unref()

    t.test('/static/index.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/index.html'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, indexContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/index.css', t => {
      t.plan(2 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/index.css'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, indexContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static', t => {
      t.plan(2)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 404)
      })
    })

    t.test('/static/deep/path/for/test/purpose/foo.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/deep/path/for/test/purpose/foo.html'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, deepContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/deep/path/for/test/', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/deep/path/for/test/'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, innerIndex)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/this/path/doesnt/exist.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/this/path/doesnt/exist.html',
        followRedirect: false
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 404)
        t.strictEqual(body, body404)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/../index.js', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/../index.js',
        followRedirect: false
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 403)
        t.strictEqual(body, body403)
        genericResponseChecks(t, response)
      })
    })
  })
})

t.test('register /static/', t => {
  t.plan(9)

  const pluginOptions = {
    root: path.join(__dirname, '/static'),
    prefix: '/static/'
  }
  const fastify = require('fastify')()
  fastify.register(fastifyStatic, pluginOptions)

  fastify.listen(0, err => {
    t.error(err)

    fastify.server.unref()

    t.test('/static/index.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/index.html'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, indexContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/index.css', t => {
      t.plan(2 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/index.css'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, indexContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static', t => {
      t.plan(2)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 404)
      })
    })

    t.test('/static/deep/path/for/test/purpose/foo.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/deep/path/for/test/purpose/foo.html'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, deepContent)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/deep/path/for/test/', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/deep/path/for/test/'
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, innerIndex)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/this/path/doesnt/exist.html', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/this/path/doesnt/exist.html',
        followRedirect: false
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 404)
        t.strictEqual(body, body404)
        genericResponseChecks(t, response)
      })
    })

    t.test('/static/../index.js', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/static/../index.js',
        followRedirect: false
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 403)
        t.strictEqual(body, body403)
        genericResponseChecks(t, response)
      })
    })
  })
})

t.test('sendFile', t => {
  t.plan(2)

  const pluginOptions = {
    root: path.join(__dirname, '/static'),
    prefix: '/static'
  }
  const fastify = require('fastify')()
  fastify.register(fastifyStatic, pluginOptions)

  fastify.get('/foo/bar', function (req, reply) {
    reply.sendFile('/index.html')
  })

  fastify.listen(0, err => {
    t.error(err)

    fastify.server.unref()

    t.test('reply.sendFile()', t => {
      t.plan(3 + GENERIC_RESPONSE_CHECK_COUNT)
      request.get({
        method: 'GET',
        uri: 'http://localhost:' + fastify.server.address().port + '/foo/bar',
        followRedirect: false
      }, (err, response, body) => {
        t.error(err)
        t.strictEqual(response.statusCode, 200)
        t.strictEqual(body, indexContent)
        genericResponseChecks(t, response)
      })
    })
  })
})

t.test('prefix default', t => {
  t.plan(1)
  const pluginOptions = {root: path.join(__dirname, 'static')}
  const fastify = require('fastify')({logger: false})
  t.doesNotThrow(() => fastify.register(fastifyStatic, pluginOptions))
})

t.test('send options', t => {
  t.plan(11)
  const pluginOptions = {
    root: path.join(__dirname, '/static'),
    acceptRanges: 'acceptRanges',
    cacheControl: 'cacheControl',
    dotfiles: 'dotfiles',
    etag: 'etag',
    extensions: 'extensions',
    immutable: 'immutable',
    index: 'index',
    lastModified: 'lastModified',
    maxAge: 'maxAge'
  }
  const fastify = require('fastify')({logger: false})
  const fastifyStatic = require('proxyquire')('../', {
    send: function sendStub (req, pathName, options) {
      t.strictEqual(pathName, '/index.html')
      t.strictEqual(options.root, path.join(__dirname, '/static'))
      t.strictEqual(options.acceptRanges, 'acceptRanges')
      t.strictEqual(options.cacheControl, 'cacheControl')
      t.strictEqual(options.dotfiles, 'dotfiles')
      t.strictEqual(options.etag, 'etag')
      t.strictEqual(options.extensions, 'extensions')
      t.strictEqual(options.immutable, 'immutable')
      t.strictEqual(options.index, 'index')
      t.strictEqual(options.lastModified, 'lastModified')
      t.strictEqual(options.maxAge, 'maxAge')
      return { on: () => {}, pipe: () => {} }
    }
  })
  fastify.register(fastifyStatic, pluginOptions)
  fastify.inject({url: '/index.html'})
})

t.test('setHeaders option', t => {
  t.plan(6 + GENERIC_RESPONSE_CHECK_COUNT)

  const pluginOptions = {
    root: path.join(__dirname, 'static'),
    setHeaders: function (res, pathName) {
      t.strictEqual(pathName, path.join(__dirname, 'static/index.html'))
      res.setHeader('X-Test-Header', 'test')
    }
  }
  const fastify = require('fastify')()
  fastify.register(fastifyStatic, pluginOptions)

  fastify.listen(0, err => {
    t.error(err)

    fastify.server.unref()

    request.get({
      method: 'GET',
      uri: 'http://localhost:' + fastify.server.address().port + '/index.html',
      followRedirect: false
    }, (err, response, body) => {
      t.error(err)
      t.strictEqual(response.statusCode, 200)
      t.strictEqual(response.headers['x-test-header'], 'test')
      t.strictEqual(body, indexContent)
      genericResponseChecks(t, response)
    })
  })
})

t.test('errors', t => {
  t.plan(12)

  t.test('no root', t => {
    t.plan(1)
    const pluginOptions = {}
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('root is not a string', t => {
    t.plan(1)
    const pluginOptions = { root: 42 }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('root is not an absolute path', t => {
    t.plan(1)
    const pluginOptions = { root: './my/path' }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('root doesn\'t exist', t => {
    t.plan(1)
    const pluginOptions = { root: path.join(__dirname, 'foo', 'bar') }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('root is not a directory', t => {
    t.plan(1)
    const pluginOptions = { root: __filename }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page500Path is not a string', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page500Path: 42 }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page500Path is not a file', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page500Path: __dirname }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page404Path is not a string', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page404Path: 42 }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page404Path is not a file', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page404Path: __dirname }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page403Path is not a string', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page403Path: 42 }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('page403Path is not a file', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, page403Path: __dirname }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, Error)
    })
  })

  t.test('setHeaders is not a function', t => {
    t.plan(1)
    const pluginOptions = { root: __dirname, setHeaders: 'headers' }
    const fastify = require('fastify')({logger: false})
    fastify.register(fastifyStatic, pluginOptions, err => {
      t.equal(err.constructor, TypeError)
    })
  })
})
