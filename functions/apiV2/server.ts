import { ApolloServer, makeExecutableSchema } from 'apollo-server-lambda';
import { Logger } from './util';
import { schema, resolvers } from './graphql';

const logger = new Logger('server.ts');

const exeSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const server = new ApolloServer({
  schema: exeSchema
});

const handler = server.createHandler({
  cors: {
    origin: '*'
  }
});

export function main (event, context, callback) {
  logger.log(`event = ${JSON.stringify(event, null, 2)}`);
  logger.log(`context = ${JSON.stringify(context, null, 2)}`);
  const callbackFilter = function (error, output) {
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  };
  return handler(event, context, callbackFilter);
}

