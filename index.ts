import Koa, { Context } from 'koa';
import KoaRouter from 'koa-router';
import R from 'ramda';
import { ApolloServer } from 'apollo-server-koa';
import { typeDefs, resolvers } from './src/lib/gql';
import db from './src/lib/model';
import { settingLoginStatus } from './src/middleware';
import { Document } from 'mongoose';
import { IUserDocument } from './src/lib/model/user';

export interface IResolverContext {
  isLogined: boolean;
  user: null | IUserDocument;
};

const defaultResolverContext: IResolverContext = {
  isLogined: false,
  user: null,
};

(async function main() {
  const router = new KoaRouter();
  const server = new ApolloServer({
      typeDefs: typeDefs,
      resolvers,
      async context({ctx}: {ctx: Context}):Promise<IResolverContext> {
          const setedContext = await settingLoginStatus(defaultResolverContext, ctx);
          return setedContext;
      }
    });
    
  
  router.get('/', ctx => {
    ctx.body = 'hello, wrold';
  });
  const app = new Koa();
  app.use(router.routes());
  
  server.applyMiddleware({ app });

  await db.connect();
  
  app.listen({ port: 3030 }, () =>
    console.log(`Server ready at http://localhost:3030${server.graphqlPath}`),
  );
}());