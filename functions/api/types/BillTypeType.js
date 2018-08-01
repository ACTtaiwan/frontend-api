import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'

const BillTypeType = new GraphQLObjectType({
  name: 'BillType',
  description: 'Information of a billType',
  fields: () => ({
    chamber: { type: GraphQLString },
    code: { type: GraphQLString },
    display: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString }
  })
})

export default BillTypeType
