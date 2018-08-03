import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } from 'graphql'
import BillTypeType from './BillTypeType'
import ActionType from './ActionType'
import VersionType from './VersionType'
import RoleType from './RoleType'
import CosponsorType from './CosponsorType'
import TagType from './TagType'
import BillTrackerType from './BillTrackerType'
import BillSummaryType from './BillSummaryType'
import ArticleType from './ArticleType'

const BillType = new GraphQLObjectType({
  name: 'Bill',
  description: 'Information of a bill',
  fields: () => ({
    congress: { type: GraphQLInt },
    actions: { type: new GraphQLList(ActionType) },
    actionsAll: { type: new GraphQLList(ActionType) },
    billType: { type: BillTypeType },
    id: { type: GraphQLID },
    prefetchIds: { type: new GraphQLList(GraphQLID) },
    introducedDate: { type: GraphQLString },
    lastUpdated: { type: GraphQLString },
    sponsor: { type: RoleType },
    tags: { type: new GraphQLList(TagType) },
    cosponsors: { type: new GraphQLList(CosponsorType) },
    title: { type: GraphQLString },
    billNumber: { type: GraphQLInt },
    billCode: {
      type: GraphQLString,
      resolve: obj => `${obj.billType.display} ${obj.billNumber}`
    },
    versions: { type: new GraphQLList(VersionType) },
    trackers: { type: new GraphQLList(BillTrackerType) },
    summary: { type: BillSummaryType },
    articles: { type: new GraphQLList(ArticleType) }
  })
})

export default BillType
