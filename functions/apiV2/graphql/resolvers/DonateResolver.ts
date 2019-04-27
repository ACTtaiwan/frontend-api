import * as rsvr from './ResolverRegistration'
import * as util from '../../util'
import { APIClient } from './APIClient'

interface IDonateRequest {
  inputs: {
    token: string,
    email: string,
    amount: number,
    currency: string,
    description: string,
    metadata: {
      card_id: string,
      type: string,
      funding: string,
      last4: string,
      country: string,
      brand: string,
      client_ip: string,
      token_created: string
    }
  };
}

export class DonateResolver implements  rsvr.IResolverFunction<IDonateRequest> {
  public readonly name: string = 'donate';
  public readonly type: rsvr.ResolveType = 'Mutation';
  private readonly logger = new util.Logger('DonateResolver');

  public resolve ({ inputs }: IDonateRequest, queryFields: rsvr.ProjectionField) {
    const fLog = this.logger.in('resolve');

    // use 'usd' as  default currency
    if (!inputs.currency) {
      inputs.currency = 'usd';
    }

    return APIClient.post('/stripe/charge', { ...inputs })
      .then(() => true)
      .catch(() => false);
  }
}
