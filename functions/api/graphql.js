import schema from './schema'
const server = require('graphql-server-lambda')

export function main (event, context, callback) {
  // const handler = server.graphqlLambda({
  //   schema
  // })
  // return handler(event, context, callback)
  console.log(`event = ${JSON.stringify(event, null, 2)}`)
  console.log(`context = ${JSON.stringify(context, null, 2)}`)
  const callbackFilter = function (error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*'
    callback(error, output)
  }
  server.graphqlLambda({ schema: schema })(event, context, callbackFilter)
}
