import { GraphQLInputObjectType, GraphQLString } from 'graphql'

const SubscriptionInputType = new GraphQLInputObjectType({
  name: 'SubscribeInput',
  description: 'Subscribe newsletter',
  fields: () => ({
    list: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
})

export default SubscriptionInputType
