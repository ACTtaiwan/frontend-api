import { GraphQLObjectType, GraphQLID, GraphQLString } from 'graphql'

const ActionType = new GraphQLObjectType({
  name: 'Action',
  description: 'Information of an action',
  fields: () => ({
    category: { type: GraphQLString },
    chamber: { type: GraphQLString },
    code: { type: GraphQLString },
    datetime: { type: GraphQLString },
    description: { type: GraphQLString },
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
})

export default ActionType
