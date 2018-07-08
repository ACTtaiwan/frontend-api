import { GraphQLList, GraphQLString, GraphQLID } from 'graphql'
import CategoryResolver from '../resolvers/CategoryResolver'
import CategoryType from '../types/CategoryType'

const CategoriesQuery = {
  type: new GraphQLList(CategoryType),
  description: 'Get current congress bill categories',
  args: {
    lang: {
      type: GraphQLString,
      description: 'Specify the returned data language'
    },
    categoryId: {
      type: GraphQLID,
      description: 'If category ID is not provided, then return all categories'
    }
  },
  resolve: (root, { categoryId }, source, info) => {
    const categoryResolver = new CategoryResolver()
    return categoryId ? [categoryResolver.getCategory({ categoryId })] : categoryResolver.getCategories({})
  }
}

export default CategoriesQuery
