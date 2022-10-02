import { ApolloServer} from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import {typeDefs} from './schema/index.js'
import {resolvers} from './resolvers/index.js'


async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
 
  await server.start();

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)

// typeDefs - how data is going to look like or a schema
// resolvers - function that fires based on the particular typeDef (schema)