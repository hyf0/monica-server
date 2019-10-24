import Koa, { Context as KoaContext } from 'koa';
import KoaRouter from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import { settingLoginStatus } from './src/middleware';
import { IUserDocument } from './src/Model/user';
import { db } from './src/Model';
import typeDefs from './src/gql/typeDefs';
import resolvers from './src/gql/resolvers';
import serverConfig from './src/serverConfig';

export interface IResolverContext {
  isLogined: boolean;
  user: null | IUserDocument;
};

const defaultResolverContext: IResolverContext = {
  isLogined: false,
  user: null,
};

(async function main() {
  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    async context({ctx}: {ctx: KoaContext}):Promise<IResolverContext> {
      const setedContext = await settingLoginStatus(defaultResolverContext, ctx);
      return setedContext;
    }
  });

  const router = new KoaRouter();
  router.get('/', ctx => {
    ctx.body = 'server is running';
  });

  const app = new Koa();

  app.use(router.routes());
  apolloServer.applyMiddleware({ app });

  await db.connect();

  app.listen(serverConfig.port, serverConfig.host, () =>
    console.log(`Server ready at http://${serverConfig.host}:${serverConfig.port}${apolloServer.graphqlPath}`),
  );
}());
