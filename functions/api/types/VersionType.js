import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql'
import VersionDocumentType from './VersionDocumentType'

const VersionType = new GraphQLObjectType({
  name: 'Version',
  description: 'Information of a version',
  fields: () => ({
    chamber: { type: GraphQLString },
    code: { type: GraphQLString },
    date: { type: GraphQLString },
    description: { type: GraphQLString },
    documents: { type: new GraphQLList(VersionDocumentType) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString }
  })
})

export default VersionType
