import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import connectDB from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();

// Create Express app
const app = express();

// Set up session middleware
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
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
    },
  })
);

// Configure Passport
configurePassport(app);

const httpServer = http.createServer(app);

// Apollo Server setup
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure Apollo Server starts
await server.start();

// Set up Apollo Server middleware
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// Start the server
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB(); // Connect to the database

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
