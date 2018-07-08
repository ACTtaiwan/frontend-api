import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql'
import ProfilePictureType from './ProfilePictureType'

const PersonType = new GraphQLObjectType({
  name: 'Person',
  description: 'Information of a congress member person',
  fields: () => ({
    firstname: { type: GraphQLString },
    gender: { type: GraphQLString },
    lastname: { type: GraphQLString },
    middlename: { type: GraphQLString },
    bioGuideId: { type: GraphQLString },
    profilePictures: { type: ProfilePictureType },
    id: { type: new GraphQLNonNull(GraphQLID) }
  })
})

export default PersonType
