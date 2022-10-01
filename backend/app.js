import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import {categories, data} from './data.js';

const typeDefs = gql `
    type Query {
        category (name: ID!): Category!
        product (name: ID!): Product
        products: [Product!]!
        categories: [Category!]!
    }

    type Product {
        name: String!
        price: Int!
        onSale: Boolean!
        description: String!
        categoryId: String!
        category: Category
    }

    type Category {
        id: String!
        name: String!
        products: [Product!]!
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
            return categories.find((c) => c.name === name)
        }
    },
    Category: {
        products : (parent, args, context) => {
            const categoryId = parent.id
            return data.filter((d) => d.categoryId === categoryId)
        }
    },
    Product: {
        category: (parent, args, context) => {
            const {categoryId} = parent
            return categories.find((c) => c.id === categoryId)
        }
    }
}

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs, // how data is going to look like or a schema
    resolvers, // function that fires based on the particular typeDef (schema)
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
 
  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)