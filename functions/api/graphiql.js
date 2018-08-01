const server = require('apollo-server-lambda')

export async function main (event, context, callback) {
  const handler = server.graphiqlLambda({
    endpointURL: '/dev/api'
  })
  return handler(event, context, callback)
}
