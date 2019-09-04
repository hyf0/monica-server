import Koa from 'koa';
import { getServerConfig } from './config/server';
import { routing } from './routers';
import { logger, decodeJWT, parseJWT, allowCROS } from './middleware';
import koaBody from 'koa-body';
import koaJsonError from 'koa-json-error';
import { connectDb } from './models';
import { isDevelopment } from './utils';
import { formatError } from './error';
// import koaParameter from 'koa-parameter';

const serverConfig = getServerConfig();

(async function main() {
  const app = new Koa();

  if (isDevelopment()) console.log('现在正处于开发模式');

  try {
    await connectDb();
  } catch (err) {
    console.error('数据库连接失败', err);
  }
  console.log('数据库连接成功');

  // --- beside request


  app.use(koaJsonError({
    format: formatError,
  }));

  app.use(logger);

  // --- beside request

  // pre process request

  app.use(koaBody());

  app.use(parseJWT());

  app.use(decodeJWT());

  app.use(allowCROS);

  // pre process request

  await routing(app);

  app.listen(serverConfig.port, serverConfig.host, () => {
    console.log(
      `Start Server in http://${serverConfig.host}:${serverConfig.port}`
    );
  });
})();
