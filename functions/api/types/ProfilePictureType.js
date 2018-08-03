import { GraphQLObjectType, GraphQLString } from 'graphql'

const ProfilePictureType = new GraphQLObjectType({
  name: 'ProfilePicture',
  description: 'Congress member profile picture',
  fields: () => ({
    tiny: { type: GraphQLString, resolve: obj => obj['50px'] },
    small: { type: GraphQLString, resolve: obj => obj['100px'] },
    medium: { type: GraphQLString, resolve: obj => obj['200px'] },
    original: { type: GraphQLString, resolve: obj => obj['origin'] }
  })
})

export default ProfilePictureType
