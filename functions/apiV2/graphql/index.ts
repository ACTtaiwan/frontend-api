import { mergeTypes } from 'merge-graphql-schemas'
import types from './schema/types'
import queries from './schema/queries'
import mutations from './schema/mutations'

export const schema = mergeTypes([types, queries, mutations])

export { default as resolvers } from './resolvers/ResolverRegistration'
