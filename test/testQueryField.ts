import { ProjectionField } from '../functions/apiV2/graphql/resolvers/ResolverRegistration';

const f = new ProjectionField([
  'congress',
  'id',
  {
    'billType': new ProjectionField([
      'display',
      'code'
    ])
  },
  'billNumber',
  'title',
  {
    'tags': new ProjectionField([
      'tag'
    ])
  }
]);

console.log(f.compositeFields);
console.log(JSON.stringify(f.toJSON(), null, 2));

