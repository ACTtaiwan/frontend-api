import { GraphQLObjectType, GraphQLString } from 'graphql'

const VersionDocumentType = new GraphQLObjectType({
  name: 'VersionDocument',
  description: 'Information of a version document',
  fields: () => ({
    s3Entity: { type: GraphQLString },
    contentType: { type: GraphQLString }
  })
})

export default VersionDocumentType
