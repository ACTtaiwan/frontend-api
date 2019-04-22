import { gql } from 'apollo-server-lambda';
import { mergeTypes } from 'merge-graphql-schemas';

const subscribe = gql`
  input SubscribeInput {
    email: String!,
    name: String,
    list: String
  }

  type Mutation {
    subscribe (
      inputs: SubscribeInput
    ): Boolean
  }
`;

export default mergeTypes([subscribe]);