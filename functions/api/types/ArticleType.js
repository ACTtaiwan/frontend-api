import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } from 'graphql'

const ArticleType = new GraphQLObjectType({
  name: 'Article',
  description: 'Information of a article',
  fields: () => ({
    id: { type: GraphQLID },
    readableId: { type: GraphQLString },
    headline: { type: GraphQLString },
    subhead: { type: GraphQLString },
    author: { type: GraphQLString },
    intro: { type: GraphQLString },
    url: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    date: { type: GraphQLString },
    sites: { type: new GraphQLList(GraphQLString) }
  })
})

export default ArticleType
