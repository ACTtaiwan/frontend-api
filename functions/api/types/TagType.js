import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql'
import BillType from './BillType'

const CategoryType = new GraphQLObjectType({
  name: 'Tag',
  description: 'Information of a bill tag',
  fields: () => ({
    tag: { type: new GraphQLNonNull(GraphQLString) },
    bills: { type: new GraphQLList(BillType) }
  })
})

export default CategoryType
