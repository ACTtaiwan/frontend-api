import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql'
import BillType from './BillType'

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'Information of a bill category',
  fields: () => ({
    bills: { type: new GraphQLList(BillType) },
    code: { type: GraphQLString },
    description: { type: GraphQLString },
    description_zh: { type: GraphQLString },
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    name_zh: { type: GraphQLString }
  })
})

export default CategoryType
