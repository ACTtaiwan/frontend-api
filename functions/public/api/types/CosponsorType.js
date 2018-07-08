import { GraphQLObjectType, GraphQLString } from 'graphql'
import RoleType from './RoleType'

const CosponsorType = new GraphQLObjectType({
  name: 'Cosponsor',
  description: 'Information of a cosponsor for a bill',
  fields: () => ({
    role: { type: RoleType },
    dateCosponsored: { type: GraphQLString }
  })
})

export default CosponsorType
