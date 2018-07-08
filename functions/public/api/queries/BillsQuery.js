import { GraphQLList, GraphQLID, GraphQLInt, GraphQLString } from 'graphql'
import BillResolver from '../resolvers/BillResolver'
import BillType from '../types/BillType'
import Utils from '../utils'

const BillsQuery = {
  type: new GraphQLList(BillType),
  description: 'Get bills',
  args: {
    lang: {
      type: GraphQLString,
      description: 'Specify the returned data language'
    },
    ids: {
      type: new GraphQLList(GraphQLID),
      description: 'If ids is an empty array, then will only return queried bill ids as result'
    },
    congress: {
      type: new GraphQLList(GraphQLInt),
      description: 'The congress year'
    },
    categories: {
      type: new GraphQLList(GraphQLID),
      description: 'An array of category id'
    }
  },
  resolve: (root, { ids, congress, categories }, source, info) => {
    const utils = new Utils()
    const billResolver = new BillResolver()
    console.log('INCOMING', JSON.stringify({ ids, congress, categories }, null, 2))
    const queryFields = utils.getSelectedFields(info.operation)
    return billResolver.getBills({ ids, congress, categories, queryFields })
  }
}

export default BillsQuery
