import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql'

const BillTrackerType = new GraphQLObjectType({
  name: 'BillTracker',
  description: 'Information of the bill tracker',
  fields: () => ({
    selected: { type: GraphQLBoolean },
    stepName: { type: GraphQLString }
  })
})

export default BillTrackerType
