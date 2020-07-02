const fastify = require('fastify')()
const mime = require('mime')

const { promises: fs, constants: { R_OK } } = require('fs')

fastify.register(require('fastify-metrics'), { endpoint: '/__metrics' })

fastify.get('/', async (request, reply) => {
  const agent = request.headers['User-Agent']
  if (agent && agent.startsWith('curl/')) {
    return { wyjebalo: 'nie' }
  }

  const accept = request.headers['Accept']

  if (accept) {
    if (accept === 'text/none') {
      return ''
    }

    if (accept.endsWith('/json')) {
      return { wyjebalo: 'nie' }
    }
  }

  reply.type('html')
  return fs.readFile(`${__dirname}/dist/index.html`)
})

fastify.get('/*', async ({ req: { originalUrl } }, reply) => {
  const queryIndex = originalUrl.indexOf('?')
  const file = originalUrl.slice(0, queryIndex === -1 ? Infinity : queryIndex)
  reply.type(mime.getType(file.slice(file.lastIndexOf('.'))))
  return fs.readFile(`${__dirname}/dist${file}`)
})


fastify.listen({
  port: process.env.PORT || 8083,
  host: '0.0.0.0'
})
