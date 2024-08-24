const userTypeDef = `#graphql
  type User {
    _id: ID!
    username: String!
    email: String!
    name: String!
    password: String!
    profilePicture: String
    gender: String!
    transactions: [Transaction!]
    createdAt: String!
    lastLogin: String
  }

  type Query {
    authUser: User
    user(userId: ID!): User
  }

  type Mutation {
    signUp(input: SignUpInput!): User
    login(input: LoginInput!): User
    logout: LogoutResponse
    updateProfile(input: UpdateProfileInput!): User
  }

  input SignUpInput {
    username: String!
    email: String!
    name: String!
    password: String!
    gender: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    profilePicture: String
    gender: String
  }

  type LogoutResponse {
    message: String!
    success: Boolean!
  }
`;

export default userTypeDef;