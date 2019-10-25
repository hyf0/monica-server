import Koa, { Context as KoaContext } from 'koa';
import KoaRouter from 'koa-router';
import { ApolloServer } from 'apollo-server-koa';
import { settingLoginStatus } from './src/middleware';
import { IUserDocument } from './src/model/user';
import { db } from './src/model';
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

  let requestCount = 0;
  const apolloServer = new ApolloServer({ // 创建 gql 服务器
    typeDefs,
    resolvers,
    async context({ctx}: {ctx: KoaContext}):Promise<IResolverContext> {
      requestCount += 1;
      // 进行鉴权设置
      const setedContext = await settingLoginStatus(defaultResolverContext, ctx);
      return setedContext;
    }
  });



  const app = new Koa();

  // 设置中间件

  const router = new KoaRouter();
  router.get('/', ctx => {
    ctx.body = `server is running, and has handled ${requestCount} request`;
  });
  app.use(router.routes());

  apolloServer.applyMiddleware({ app });

  // 连接数据库
  try {
    await db.connect(serverConfig.dbUrl);
  } catch (err) {
    console.error(err);
  }

  app.listen(serverConfig.port, serverConfig.host, () =>
    console.log(`Server ready at http://${serverConfig.host}:${serverConfig.port}${apolloServer.graphqlPath}`),
  );
}());
