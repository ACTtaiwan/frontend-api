import { gql } from 'apollo-server-lambda'
import { mergeTypes } from 'merge-graphql-schemas'

const subscribe = gql`
  input SubscribeInput {
    email: String!
    name: String
    list: String
  }

  type Mutation {
    subscribe(inputs: SubscribeInput): Boolean
  }
`

const donate = gql`
  input DonateMetadata {
    card_id: String
    type: String
    funding: String
    last4: String
    country: String
    brand: String
    client_ip: String
    token_created: Int
  }

  input DonateInput {
    token: String!
    email: String
    amount: Int
    currency: String
    description: String
    metadata: DonateMetadata
  }

  type Mutation {
    donate(inputs: DonateInput): Boolean
  }
`

export default mergeTypes([subscribe, donate])
