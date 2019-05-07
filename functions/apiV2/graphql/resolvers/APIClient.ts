import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';
import { Logger } from '../../util';
import * as qs from 'qs';
import config from '../../../../config/appConfig';

export class APIClient {
  private static readonly logger = new Logger('APIHelper');

  public static get (path: string, params?: any) {
    return APIClient.perform('GET', path, params);
  }

  public static post (path: string, body: any) {
    return APIClient.perform('POST', path, undefined, undefined, body);
  }

  private static perform (method: 'GET' | 'POST' | 'DELETE' | 'PUT', path: string, params?: any, headers?: any, body?: any) {
    const fLog = APIClient.logger.in('perform');

    const req: AxiosRequestConfig = {
      method,
      baseURL: config.backendApi.ENDPOINT,
      url: path,
      headers: {
        'content-type': 'application/json',
        'x-api-key': config.backendApi.KEY
      },
      paramsSerializer: (params) => {
        params = JSON.parse(JSON.stringify(params));
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    };

    if (headers && !_.isEmpty(headers)) {
      req.headers = _.merge(req.headers, headers);
    }

    params && (req.params = params);
    body && (req.data = body);

    fLog.log(`[OUTGOING REQUEST] ${JSON.stringify(req, null, 2)}`);
    return axios(req).then(response => {
      if (response && response.data) {
        fLog.log(`[OUTGOING RESPONSE] ${JSON.stringify(response.data, null, 2)}`);
        return response.data;
      }
      return null;
    });
  }
}