const transactionTypeDef = `#graphql
  type Transaction {
    _id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    currency: String!
    location: String
    date: String!
    tags: [String]
    isRecurring: Boolean
    recurringFrequency: String
    notes: String
    attachments: [String]
    user: User!
  }

  type Query {
    transactions(filter: TransactionFilterInput): [Transaction!]
    transaction(transactionId: ID!): Transaction
    categoryStatistics(period: String): [CategoryStatistics!]
    monthlySpending(year: Int!): [MonthlySpending!]
    transactionsByDateRange(startDate: String!, endDate: String!): [Transaction!]
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!
    bulkDeleteTransactions(transactionIds: [ID!]!): BulkDeleteResponse!
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
    transactionCount: Int!
  }

  type MonthlySpending {
    month: Int!
    totalAmount: Float!
  }

  type BulkDeleteResponse {
    deletedCount: Int!
    success: Boolean!
  }

  input CreateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    currency: String!
    date: String!
    location: String
    tags: [String]
    isRecurring: Boolean
    recurringFrequency: String
    notes: String
    attachments: [String]
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    currency: String
    location: String
    date: String
    tags: [String]
    isRecurring: Boolean
    recurringFrequency: String
    notes: String
    attachments: [String]
  }

  input TransactionFilterInput {
    category: String
    paymentType: String
    minAmount: Float
    maxAmount: Float
    startDate: String
    endDate: String
    tags: [String]
  }
`;

export default transactionTypeDef;