import Router from 'koa-router';

const rootRouter = new Router();

rootRouter.get('/', ctx => {
  ctx.body = '<h1>monica server is running</h1>';
});

export default rootRouter;
