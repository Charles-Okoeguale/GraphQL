import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import {categories, data} from './data.js';

const typeDefs = gql `
    type Query {
        products: [Product!]!
        product (name: ID!): Product
        categories: [Category!]!
        category (name: ID!) : Category!
    }

    type Product {
        name: String!
        price: Int!
        onSale: Boolean!
        description: String!
    }

    type Category {
        id : String!
        name: String!
    }
`
 
const resolvers = {
    Query: {
        products: () => data,
        product : (parent, args, context) => {
            const productName = args.name
            const product = data.find((p) => p.name === productName)
            if (!product) return null
            return product
        },
        categories: () => categories,
        category: (parent, args, context) => {
            const {name} = args
            console.log(name)
        }
    }
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs, // how data is going to look like or a schema
    resolvers, // function that's responsible for populating the data for a single field in your schema or function fired
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
 
  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)