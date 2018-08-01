import { GraphQLList, GraphQLString, GraphQLInt, GraphQLID } from 'graphql'
import MemberResolver from '../resolvers/MemberResolver'
import RoleType from '../types/RoleType'
import Utils from '../utils'

const MembersQuery = {
  type: new GraphQLList(RoleType),
  description: 'Get members',
  args: {
    lang: {
      type: GraphQLString,
      description: 'Specify the returned data language'
    },
    ids: {
      type: new GraphQLList(GraphQLID),
      description: 'If ids & personIds are both an empty array, then will only return queried member ids as result'
    },
    personIds: {
      type: new GraphQLList(GraphQLID),
      description: 'If personIds & ids are both an empty array, then will only return queried member ids as result'
    },
    congress: {
      type: new GraphQLList(GraphQLInt),
      description: 'The congress year'
    },
    states: {
      type: new GraphQLList(GraphQLString),
      description: 'An array of state'
    }
  },
  resolve: (root, { ids, personIds, congress, states }, source, info) => {
    const utils = new Utils()
    const memberResolver = new MemberResolver()
    console.log('INCOMING', JSON.stringify({ ids, personIds, congress, states }, null, 2))
    const queryFields = utils.getSelectedFields(info.operation)
    return memberResolver.getMembers({ ids, personIds, congress, states, queryFields })
  }
}

export default MembersQuery
