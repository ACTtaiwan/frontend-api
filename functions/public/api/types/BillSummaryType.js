import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'

const BillSummaryType = new GraphQLObjectType({
  name: 'BillSummary',
  description: 'Information of the bill summary',
  fields: () => ({
    title: { type: GraphQLString },
    paragraphs: { type: new GraphQLList(GraphQLString) }
  })
})

export default BillSummaryType
