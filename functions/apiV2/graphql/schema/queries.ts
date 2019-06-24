import { gql } from 'apollo-server-lambda';
import { mergeTypes } from 'merge-graphql-schemas';

const bills = gql`
  type Query {
    """
    Get bills
    """
    bills(
      """
      Specify the returned data language
      """
      lang: String

      """
      If ids is an empty array, then will only return queried bill ids as result
      """
      ids: [ID]

      """
      The congress year
      """
      congress: [Int]
    ): [Bill]
  }
`;

const members = gql`
  type Query {
    """
    Get members
    """
    members(
      """
      Specify the returned data language
      """
      lang: String

      """
      If ids is an empty array, then will only return queried member ids as result
      """
      ids: [ID]

      """
      The congress year
      """
      congress: [Int]

      """
      An array of state
      """
      states: [String]
    ): [Member]
  }
`;

const maps = gql`
  type Query {
    """
    Get congressional district maps
    """
    maps(
      """
      Specify the returned data language
      """
      lang: String

      """
      If congress number is not provided, then return map utilities
      """
      congress: Int

      """
      Return the list of states and American territories
      """
      stateList: Boolean
    ): [Map]
  }
`;

const articles = gql`
  type Query {
    """
    Get articles
    """
    articles(
      """
      The article list source - "act" or "ustw"
      """
      list: String

      """
      max num of articles to fetch (default: 10)
      """
      limit: Int

      """
      timestamp (in millisec); can use the ‘date’ value of the previous response to achieve pagination (default: now)
      """
      before: String
    ): [Article]
  }
`;

export default mergeTypes([bills, members, maps, articles]);
