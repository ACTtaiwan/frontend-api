import { gql } from 'apollo-server-lambda';
import { mergeTypes } from 'merge-graphql-schemas';

const billType = gql`
  """
  Information of bill type
  """
  type BillType {
    code: String
    chamber: String
    name: String
    display: String
  }
`;

const action = gql`
  """
  Information of an action
  """
  type Action {
    chamber: String
    code: String
    datetime: String
    description: String
    name: String
  }
`;

const billTextDocument = gql`
  """
  Information of a bill text document
  """
  type BillTextDocument {
    s3Entity: String
    contentType: String
  }
`;

const billTextVersion = gql`
  """
  Information of bill text versions
  """
  type BillTextVersion {
    chamber: String
    code: String
    date: String
    description: String
    name: String
    documents: [BillTextDocument]
  }
`;

const billTracker = gql`
  """
  Information of the bill tracker
  """
  type BillTracker {
    selected: Boolean
    stepName: String
  }
`;

const billSummary = gql`
  """
  Information of the bill summary
  """
  type BillSummary {
    title: String
    paragraphs: [String]
  }
`;

const tag = gql`
  """
  Information of a bill tag
  """
  type Tag {
    id: ID
    tag: String
    bills: [BillType]
  }
`;

const article = gql`
  """
  Information of a article
  """
  type Article {
    id: ID
    readableId: String
    headline: String
    subhead: String
    author: String
    intro: String
    url: String
    imageUrl: String
    date: String
    sites: [String]
  }
`;

const profilePicture = gql`
  """
  Congress member profile picture
  """
  type ProfilePicture {
    tiny: String
    small: String
    medium: String
    original: String
  }
`;

const congressRole = gql`
  """
  Congress role
  """
  type CongressRole {
    congressNumbers: [Int]
    chamber: String
    startDate: String
    endDate: String
    party: String
    state: String
    district: String
    senatorClass: Int

    title: String
    titleLong: String
    roleTypeDisplay: String
    senatorClassDisplay: String
  }
`;

const member = gql`
  """
  Information of a congress member
  """
  type Member {
    id: ID
    prefetchIds: [ID]
    firstName: String
    firstName_zh: String
    lastName: String
    lastName_zh: String
    middleName: String
    gender: String

    bioGuideId: String
    youtubeId: String
    facebookId: String
    twitterId: String
    cspanId: String
    website: String
    office: String
    phone: String

    profilePictures: ProfilePicture

    congressRoles: [CongressRole]
    currentRole: CongressRole
    latestRole: CongressRole

    billIdSponsored: [String]
    billIdCosponsored: [String]
    cosponsorProperty: [CosponsorProperty]
  }

  type CosponsorProperty {
    billId: String
    dateCosponsored: String
  }
`;

const bill = gql`
  """
  Information of a bill
  """
  type Bill {
    id: ID
    prefetchIds: [ID]
    congress: Int
    billType: BillType
    billNumber: Int
    billCode: String
    title: String
    title_zh: String
    actions: [Action]
    actionsAll: [Action]
    introducedDate: String
    versions: [BillTextVersion]
    trackers: [BillTracker]
    summary: BillSummary
    sponsor: Member
    cosponsors: [Cosponsor]
    tags: [Tag]
    articles: [Article]
    gist: String
  }

  type Cosponsor {
    dateCosponsored: String
    member: Member
  }
`;

const map = gql`
  """
  Map data
  """
  type Map {
    cdMap: String
    usMap: String
    stateToFips: String
    fipsToState: String
    states: String
  }
`;

export default mergeTypes([
  bill,
  action,
  billType,
  billTextDocument,
  billTextVersion,
  billTracker,
  billSummary,
  tag,
  article,
  map,
  member,
  profilePicture,
  congressRole
]);
