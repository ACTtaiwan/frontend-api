import * as rsvr from './ResolverRegistration';
import * as util from '../../util';
import { APIClient } from './APIClient';

interface IDonateRequest {
  inputs: {
    token: string,
    email: string,
    amount: number,
    currency: string,
    description: string
  };
}

export class DonateResolver implements  rsvr.IResolverFunction<IDonateRequest> {
  public readonly name: string = 'donate';
  public readonly type: rsvr.ResolveType = 'Mutation';
  private readonly logger = new util.Logger('DonateResolver');

  public resolve ({ inputs }: IDonateRequest, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');

    // use 'usd' as default currency
    if (!inputs.currency) {
      inputs.currency = 'usd';
    }

    return APIClient.post('/stripe/charge', { ...inputs })
      .then(data => {
        console.log('0000000', data);

        return {
          isSuccess: true,
          statusCode: 200,
          errorMsg: ''
        };
      })
      .catch(({response}) => {
        console.log('111111', response);

        return {
          isSuccess: false,
          statusCode: response.status,
          errorMsg: response.data.message
        };
      });
  }
}
