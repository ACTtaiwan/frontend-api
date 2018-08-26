import { GraphQLBoolean } from 'graphql'
import SubscribeResolver from '../resolvers/SubscribeResolver'
import SubscriptionInputType from '../types/SubscriptionInputType'

const SubscribeMutation = {
  type: GraphQLBoolean,
  description: 'Subscribe newsletters',
  args: {
    inputs: {
      type: SubscriptionInputType,
      description: 'inputs of subscribe API. [list] The list to subscribe - "act" or "ustw". [name] Full name. [email] Email'
    }
  },
  resolve: (root, { inputs }, source, info) => {
    const resolver = new SubscribeResolver()
    return resolver.subscribe(inputs)
  }
}

export default SubscribeMutation
