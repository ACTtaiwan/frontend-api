import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLString, GraphQLList } from 'graphql'
import PersonType from './PersonType'

const RoleType = new GraphQLObjectType({
  name: 'Role',
  description: 'Information of a congress member role',
  fields: () => ({
    caucus: { type: GraphQLString },
    congressNumbers: { type: new GraphQLList(GraphQLInt) },
    createdAt: { type: GraphQLInt },
    description: { type: GraphQLString },
    district: { type: GraphQLInt },
    endDate: { type: GraphQLInt },
    id: { type: new GraphQLNonNull(GraphQLID) },
    prefetchIds: { type: new GraphQLList(GraphQLID) },
    lastUpdatedAt: { type: GraphQLInt },
    office: { type: GraphQLString },
    leadershipTitle: { type: GraphQLString },
    phone: { type: GraphQLString },
    party: { type: GraphQLString },
    person: { type: PersonType },
    roleType: { type: GraphQLString },
    roleTypeDisplay: { type: GraphQLString },
    senatorClass: { type: GraphQLString },
    senatorClassDisplay: { type: GraphQLString },
    senatorRank: { type: GraphQLString },
    senatorRankDisplay: { type: GraphQLString },
    startDate: { type: GraphQLInt },
    state: { type: GraphQLString },
    title: { type: GraphQLString },
    titleLong: { type: GraphQLString },
    website: { type: GraphQLString },
    billIdCosponsored: { type: new GraphQLList(GraphQLID) },
    billIdSponsored: { type: new GraphQLList(GraphQLID) }
  })
})

export default RoleType
