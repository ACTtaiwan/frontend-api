import * as rsvr from './ResolverRegistration';
import * as util from '../../util';
import * as aws from 'aws-sdk';

const awsConfig = require('../../../../config/aws.json');

interface IMapQuery {
  lang: string;
  congress: number;
  stateList: boolean;
}

export class MapResolver implements  rsvr.IResolverFunction<IMapQuery> {
  public readonly name: string = 'maps';
  public readonly type: rsvr.ResolveType = 'Query';

  private readonly logger = new util.Logger('MemberResolver');

  public async resolve ({lang, congress, stateList}: IMapQuery, queryFields: rsvr.ProjectionField) {
    if (congress) {
      return [ await this.getCdMap(congress) ];
    } else if (stateList) {
      return [ await this.getStateList() ];
    } else {
      return [ await this.getMapUtils() ];
    }
  }

  private getCdMap (congress: number) {
    return this.getS3Object(`map/us-cd${congress}-topo.json`)
      .then(data => { return { cdMap: data }; })
      .catch(err => { return { cdMap: undefined }; });
  }

  private getStateList () {
    return this.getS3Object('map/stateCodeToName.json')
      .then(data => {
        return { states: data };
      });
  }

  private getMapUtils () {
    return Promise.all([
      this.getS3Object('map/us.json'),
      this.getS3Object('map/fipsToState.json'),
      this.getS3Object('map/stateToFips.json')
    ]).then(result => {
      return {
        usMap: result[0],
        fipsToState: result[1],
        stateToFips: result[2]
      };
    });
  }

  private getS3Object (key: string): Promise<string> {
    const fLog = this.logger.in('getS3Object');
    const s3 = new aws.S3();
    const params: aws.S3.Types.GetObjectRequest = {
      Bucket: awsConfig.s3.STATIC_FILES_BUCKET_NAME,
      Key: key
    };

    return new Promise((resolve, reject) => {
      s3
      .getObject(params)
      .promise()
      .then(data => {
        if (data.Body) {
          fLog.log(`get s3 obj (${key}) success. Length = ${data.Body.toString().length}`);
          resolve(data.Body.toString());
        } else {
          reject(`data.Body is not available`);
        }
      })
      .catch(error => {
        fLog.log(`get s3 obj (${key}) failed ${JSON.stringify(error, null, 2)}`);
        reject(error);
      });
    });
  }
}
