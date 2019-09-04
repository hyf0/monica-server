import Koa from 'koa';
import Router from 'koa-router';
import fs from 'fs';
import path from 'path';

import { load } from '../utils';

export async function routing(app: Koa) {
  const routerNames = fs
    .readdirSync(__dirname)
    .filter(name => !name.includes('index'));
  const routers = await Promise.all<Router>(
    routerNames.map(async routerName => {
      const modulePath = path.join(__dirname, routerName);
      const module = await load(modulePath);
      const router = module.default;
      if (!(router instanceof Router)) {
        throw new Error(
          `导入router失败，你可能没有default export对应的Router示例，在文件${modulePath}处`
        );
      }
      return router;
    })
  );
  routers.forEach(router => {
    app.use(router.routes());
    app.use(router.allowedMethods());
  });
  console.log(`路由加载完成: [${routerNames.map(s => s.replace('.ts', ''))}]`);
}
