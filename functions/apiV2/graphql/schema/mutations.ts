import { gql } from 'apollo-server-lambda';
import { mergeTypes } from 'merge-graphql-schemas';

const subscribe = gql`
  input SubscribeInput {
    list: String,
    name: String,
    email: String!
  }

  type Mutation {
    subscribe (
      inputs: SubscribeInput
    ): Boolean
  }
`;

export default mergeTypes([subscribe]);