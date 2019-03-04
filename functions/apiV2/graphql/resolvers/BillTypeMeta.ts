import * as _ from 'lodash';

const meta = [
  {
    chamber: 'senate',
    code: 'sres',
    name: 'Senate Simple Resolution',
    display: 'S.Res.'
  },
  {
    chamber: 'house',
    code: 'hjres',
    name: 'House Joint Resolution',
    display: 'H.J.Res.'
  },
  {
    chamber: 'house',
    code: 'hres',
    name: 'House Simple Resolution',
    display: 'H.Res.'
  },
  {
    chamber: 'senate',
    code: 'sjres',
    name: 'Senate Joint Resolution',
    display: 'S.J.Res.'
  },
  {
    chamber: 'house',
    code: 'hconres',
    name: 'House Concurrent Resolution',
    display: 'H.Con.Res.'
  },
  {
    chamber: 'senate',
    code: 's',
    name: 'Senate Bill',
    display: 'S.'
  },
  {
    chamber: 'house',
    code: 'hr',
    name: 'House Bill',
    display: 'H.R.'
  },
  {
    chamber: 'senate',
    code: 'sconres',
    name: 'Senate Concurrent Resolution',
    display: 'S.Con.Res.'
  }
];

export default _.keyBy(meta, 'code');
