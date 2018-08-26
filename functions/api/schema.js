import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import BillsQuery from './queries/BillsQuery'
import MembersQuery from './queries/MembersQuery'
import CategoriesQuery from './queries/CategoriesQuery'
import MapsQuery from './queries/MapsQuery'
import ArticlesQuery from './queries/ArticlesQuery'
import SubscribeMutation from './mutations/SubscribeMutation'

// ---------------- Define Query ----------------

let query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root of queries',
  fields: () => ({
    bills: BillsQuery,
    members: MembersQuery,
    categories: CategoriesQuery,
    maps: MapsQuery,
    articles: ArticlesQuery
  })
})

// ---------------- Define Mutation ----------------

let mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root of mutations',
  fields: () => ({
    subscribe: SubscribeMutation
  })
})

// ---------------- Define Schema ----------------

const schema = new GraphQLSchema({
  query,
  mutation
})

export default schema
