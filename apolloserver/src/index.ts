import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";
import { fileURLToPath } from "url";

import { resolvers } from "./graphql/resolvers.js";

// const Books = [
//   {
//     id: 1,
//     title: "Lord of the Mysteries",
//     author: "Cuttlefish That Loves Diving",
//     price: 29.99,
//   },
//   { id: 2, title: "Reverend Insanity", author: "Gu Zhen Ren", price: 39.99 },
// ];

// const typeDefs = `#graphql
//  type Book {
//     id: ID!
//     title: String!
//     author: String!
//     price: Float
// }
//  # There is also type Mutation
//  type Query {
//     books : [Book]
// }
// `;
// const resolvers = {
//   Query: {
//     books: () => Books,
//   },
// };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = gql(
  readFileSync(
    path.resolve(__dirname, "../src/graphql/schema.graphql"),
    "utf-8"
  )
);

interface MyContext {
  token?: string;
}

async function startApolloServer() {
  const server = new ApolloServer<MyContext>({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => ({
      token: req.headers.authorization || "",
    }),
  });
  console.log("Your server is running at " + url);
}

startApolloServer();
