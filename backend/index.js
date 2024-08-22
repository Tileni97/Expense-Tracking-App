import express from "express";
import http from "http";
import cors from "cors";

import { ApolloServer } from "@apollo/server"; // import ApolloServer from "apollo-server"
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";

import mergedResolvers from "./resolvers/index.js "; // import mergedResolvers from "./resolvers/index.js"
import mergedTypeDefs from "./typeDefs/index.js"; // import mergedTypeDefs from "./typeDefs/index.js"

import connectDB from "./db/connectDB.js"; // import connectDB from "./config/db.js"

dotenv.config();
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  // create a new ApolloServer instance with the merged type definitions and resolvers
  typeDefs: mergedTypeDefs, // pass the merged type definitions to the server
  resolvers: mergedResolvers, // pass the merged resolvers to the server
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/",
  cors(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB(); // connect to the database


console.log(`🚀 Server ready at http://localhost:4000/`);









//What is Apollo Server?
// Apollo Server is a community-driven, open-source GraphQL server that works with any GraphQL schema. It is built on top of the Apollo platform and provides a flexible and powerful way to build, deploy, and scale GraphQL APIs.
// Apollo Server supports various features such as schema stitching, data sources, caching, and subscriptions. It also integrates with popular web frameworks such as Express, Koa, and Fastify.
// Apollo Server is designed to be easy to use and flexible, allowing developers to build GraphQL APIs quickly and efficiently. It provides a simple and intuitive API for defining schemas, resolvers, and data sources, making it easy to get started with GraphQL.

// How to Use Apollo Server?
// To use Apollo Server, you need to install the apollo-server package using npm or yarn:
// npm install @apollo/server
// Then, you can create a new ApolloServer instance with your schema and resolvers:
// import { ApolloServer } from "apollo-server";
