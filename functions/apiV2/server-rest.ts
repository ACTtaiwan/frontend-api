require('dotenv').config();
import { ApolloServer, makeExecutableSchema, AuthenticationError } from 'apollo-server-express';
import { Logger } from './util';
import { schema, resolvers } from './graphql';
import * as express from 'express';
import * as cors from 'cors';
import * as AWS from 'aws-sdk';
import * as appInsights from 'applicationinsights';
import config from '../../config/appConfig';

// init Logger
const logger = new Logger('server.ts');

// init Application Insights (Azure telemetry)
if (!config.isLocal) {
  appInsights.setup(config.appInsights.key)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, true)
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(false);
  appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.appInsights.loggingAppName;
  appInsights.start();
  logger.log(`NODE_ENV = production. Use Application Insights. Key = ${config.appInsights.key} Role = ${config.appInsights.loggingAppName}`);
} else {
  logger.log('NODE_ENV = local. Not use Application Insights.');
}

// log basic info
logger.log(`STAGE = ${config.stage}`);
logger.log(`BACKEND_API = ${config.backendApi.ENDPOINT}`);
logger.log(`BACKEND_API_KEY = ${config.backendApi.KEY}`);
logger.log(`MY_API_KEY = ${config.myAPIKey}`);
logger.log(`IS_LOCAL = ${config.isLocal}`);

// set up AWS credentials
let awsCreds: AWS.Credentials;
if (config.aws.accessKeyId && config.aws.secretAccessKey) {
  logger.log('Use AWS creds from .env');
  awsCreds = new AWS.Credentials(config.aws);
} else {
  logger.log('Use AWS creds from ~/.aws/credentials');
  awsCreds = new AWS.SharedIniFileCredentials();
}
AWS.config.credentials = awsCreds;

const exeSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

const apollo = new ApolloServer({
  schema: exeSchema,
  context: ({req}) => {
    const token = req.headers['x-api-key'] || '';
    if (token !== config.myAPIKey) {
      throw new AuthenticationError('Invalid API Key.');
    }
   }
});

const app = express();

// Allow all CORS
app.use(cors());

apollo.applyMiddleware({ app, path: '/' });

app.listen({ port: config.port }, () =>
  logger.log('🚀 Server ready at port ' + config.port)
);
