import { GraphQLList, GraphQLID, GraphQLString } from 'graphql'
import ArticleResolver from '../resolvers/ArticleResolver'
import ArticleType from '../types/ArticleType'
import Utils from '../utils'

const ArticlesQuery = {
  type: new GraphQLList(ArticleType),
  description: 'Get articles',
  args: {
    lang: {
      type: GraphQLString,
      description: 'Specify the returned data language'
    },
    ids: {
      type: new GraphQLList(GraphQLID),
      description: 'If ids is an empty array, then will only return queried articles ids as result'
    },
    sources: {
      type: new GraphQLList(GraphQLString),
      description: 'The article source'
    }
  },
  resolve: (root, { ids, sources }, source, info) => {
    const utils = new Utils()
    const articleResolver = new ArticleResolver()
    console.log('INCOMING', JSON.stringify({ ids }, null, 2))
    const queryFields = utils.getSelectedFields(info.operation)
    return articleResolver.getArticles({ ids, sources, queryFields })
  }
}

export default ArticlesQuery
