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
  type DonateResponse {
    isSuccess: Boolean
    statusCode: Int
    errorMsg: String
  }

  input DonateInput {
    token: String!
    email: String
    amount: Int
    currency: String
    description: String
  }

  type Mutation {
    donate(inputs: DonateInput): DonateResponse
  }
`

export default mergeTypes([subscribe, donate])
