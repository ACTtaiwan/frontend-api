export default class AppConfig {
  static readonly stage = process.env.STAGE || 'dev';
  static readonly port = process.env.port || process.env.PORT || 4000;
  static readonly myAPIKey = process.env.MY_API_KEY;

  static readonly aws = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  static readonly appInsights = {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    loggingAppName: `ustw-frontend-${AppConfig.stage}`
  };

  static readonly isLocal = process.env.NODE_ENV === 'local';

  static get backendApi (): { KEY: string, ENDPOINT: string } {
    let obj: any = {
      KEY: process.env.BACKEND_API_KEY,
      ENDPOINT_REMOTE: `https://ustw-backend-api-${AppConfig.stage}.azurewebsites.net`,
      ENDPOINT_LOCAL: `https://ustw-backend-api-${AppConfig.stage}.azurewebsites.net`
    };
    obj.ENDPOINT = AppConfig.isLocal ? obj.ENDPOINT_LOCAL : obj.ENDPOINT_REMOTE;
    return obj;
  }
}
