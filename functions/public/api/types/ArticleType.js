import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } from 'graphql'

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  description: 'Information of a article',
  fields: () => ({
    id: { type: GraphQLID },
    prefetchIds: { type: new GraphQLList(GraphQLID) },
    publishedAt: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    source: { type: GraphQLString },
    title: { type: GraphQLString },
    url: { type: GraphQLString }
  })
})

export default ArticleType
