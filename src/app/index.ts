import express from 'express'; 
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from '../clients/db';

import { Users } from './user';
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

export async function initServer() {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());

    // prismaClient.user.create({
    // })

    const graphqlServer = new ApolloServer<GraphqlContext>({
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

    app.use(
      "/graphql",
      expressMiddleware(graphqlServer, {
        context: async ({ req, res }) => {
          return {
            user: req.headers.authorization
              ? JWTService.decodeToken(
                  req.headers.authorization.split("Bearer ")[1]
                )
              : undefined,
          };
        },
      })
    );

    return app;
}