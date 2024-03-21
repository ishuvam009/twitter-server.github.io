import express from 'express'; 
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from '../clients/db';

import { Users } from './user';

export async function initServer() {
    const app = express();

    app.use(bodyParser.json());

    // prismaClient.user.create({
    // })

    const graphqlServer = new ApolloServer({
        typeDefs: `
        ${Users.types}

          type Query {
              ${Users.queries}
          }
        `,
        resolvers: {
          Query: {
            ...Users.resolvers.queries,
          },
        }, 
      });


    await graphqlServer.start();  

    app.use('/graphql',expressMiddleware(graphqlServer))

    return app;
}