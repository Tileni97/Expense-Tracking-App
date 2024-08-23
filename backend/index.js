import express from "express";
import http from "http";
import cors from "cors";

import { ApolloServer } from "@apollo/server"; // import ApolloServer from "apollo-server"
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv, { config } from "dotenv";

import { buildContext } from "graphql-passport";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import mergedResolvers from "./resolvers/index.js "; // import mergedResolvers from "./resolvers/index.js"
import mergedTypeDefs from "./typeDefs/index.js"; // import mergedTypeDefs from "./typeDefs/index.js"

import connectDB from "./db/connectDB.js"; // import connectDB from "./config/db.js"
import { configurePassport } from "./passport/passport.config.js"; // import configurePassport from "./passport/passport.config.js"

dotenv.config();
configurePassport(); 

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
store.on("error", (err) => {
  console.log(err);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this option specifies whether to save the session to the store on every request
    saveUninitialized: false, //this option specifies whether to create a session for an anonymous user
    store: store, 
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true, //this option prevents the cross-site scripting attacks
    },
    store: store, //this option specifies the session store to use for storing session data
  })
);

app.use(passport.initialize());
app.use(passport.session());


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
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req,res }) =>buildContext({ req,res }), //context is an object that is shared across all resolvers
  })
);

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB(); // connect to the database

console.log(`🚀 Server ready at http://localhost:4000/graphql`);

//What is Apollo Server?
// Apollo Server is a community-driven, open-source GraphQL server that works with any GraphQL schema. It is built on top of the Apollo platform and provides a flexible and powerful way to build, deploy, and scale GraphQL APIs.
// Apollo Server supports various features such as schema stitching, data sources, caching, and subscriptions. It also integrates with popular web frameworks such as Express, Koa, and Fastify.
// Apollo Server is designed to be easy to use and flexible, allowing developers to build GraphQL APIs quickly and efficiently. It provides a simple and intuitive API for defining schemas, resolvers, and data sources, making it easy to get started with GraphQL.

// How to Use Apollo Server?
// To use Apollo Server, you need to install the apollo-server package using npm or yarn:
// npm install @apollo/server
// Then, you can create a new ApolloServer instance with your schema and resolvers:
// import { ApolloServer } from "apollo-server";
