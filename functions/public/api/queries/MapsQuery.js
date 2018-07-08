import { GraphQLList, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql'
import MapResolver from '../resolvers/MapResolver'
import MapType from '../types/MapType'

const MapsQuery = {
  type: new GraphQLList(MapType),
  description: 'Get congressional district maps',
  args: {
    lang: {
      type: GraphQLString,
      description: 'Specify the returned data language'
    },
    congress: {
      type: GraphQLInt,
      description: 'If congress number is not provided, then return map utilities'
    },
    stateList: {
      type: GraphQLBoolean,
      description: 'Return the list of states and American territories'
    }
  },
  resolve: (root, { congress, stateList }) => {
    const mapResolver = new MapResolver()
    if (congress) return [mapResolver.getCdMap({ congress })]
    if (stateList) return [mapResolver.getStateList()]

    return [mapResolver.getMapUtils({})]
  }
}

export default MapsQuery
