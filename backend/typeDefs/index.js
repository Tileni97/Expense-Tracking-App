import { mergeTypeDefs } from "@graphql-tools/merge";

// Importing typeDefs
import userTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";

// Merging typeDefs
const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);    

export default mergedTypeDefs;

// Why Merge Type Definations?
// Modularity: It allows us to split our schema into multiple files, which makes it easier to manage and maintain.
// Reusability: It allows us to reuse type definitions across multiple schemas.
// Better Organization: It allows us to organize our schema in a more structured way.
//Easier Collaboration: It allows multiple developers to work on different parts of the schema without conflicts.
//Clear Separation of Concerns: It allows us to separate the concerns of different parts of the schema, such as user-related types and transaction-related types.


// How to Merge Type Definitions?
// Install the necessary packages:
// npm install @graphql-tools/merge
// Import the mergeTypeDefs function from the @graphql-tools/merge package.
// Import the type definitions that you want to merge.
// Use the mergeTypeDefs function to merge the type definitions.
// Export the merged type definitions.
// Example:
// // Importing the mergeTypeDefs function from the @graphql-tools/merge package 
// import { mergeTypeDefs } from "@graphql-tools/merge";