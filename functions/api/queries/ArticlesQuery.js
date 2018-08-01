import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql'
import ArticleResolver from '../resolvers/ArticleResolver'
import ArticleType from '../types/ArticleType'

const ArticlesQuery = {
  type: new GraphQLList(ArticleType),
  description: 'Get articles',
  args: {
    list: {
      type: GraphQLString,
      description: 'The article list source - "act" or "ustw"'
    },
    limit: {
      type: GraphQLInt,
      description: 'max num of articles to fetch (default: 10)'
    },
    before: {
      type: GraphQLString,
      description: 'timestamp (in millisec); can use the ‘date’ value of the previous response to achieve pagination (default: now)'
    }
  },
  resolve: (root, { list, limit, before }, source, info) => {
    const articleResolver = new ArticleResolver()
    return articleResolver.getArticles({ list, limit, before })
  }
}

export default ArticlesQuery
