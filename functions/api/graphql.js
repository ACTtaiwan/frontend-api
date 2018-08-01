import schema from './schema'
const server = require('graphql-server-lambda')

export async function main (event, context, callback) {
  // const handler = server.graphqlLambda({
  //   schema
  // })
  // return handler(event, context, callback)
  const callbackFilter = function (error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }
  server.graphqlLambda({ schema: schema })(event, context, callbackFilter)
}
