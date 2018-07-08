import { GraphQLObjectType, GraphQLString } from 'graphql'

const MapType = new GraphQLObjectType({
  name: 'Map',
  description: 'Map data',
  fields: () => ({
    cdMap: { type: GraphQLString },
    usMap: { type: GraphQLString },
    stateToFips: { type: GraphQLString },
    fipsToState: { type: GraphQLString },
    states: { type: GraphQLString }
  })
})

export default MapType
