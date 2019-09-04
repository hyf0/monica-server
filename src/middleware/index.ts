import { Middleware } from 'koa';
import jwt from 'jsonwebtoken';
import _ from 'ramda';

import { getServerConfig } from '../config/server';
import { thrower } from './errors';

const serverConfig = getServerConfig();

export const logger: Middleware = async function logger({ url, method, request }, next) {
  const uniId = Date.now();
  console.log(
    `${uniId}: start  ${method} ${url} in ${new Date().toLocaleTimeString()}`
  );
  await next();
  console.log(
    `${uniId}: finish ${method} ${url} in ${new Date().toLocaleTimeString()}`
  );
  // console.log('request', request);
};

export const onlyAuth: Middleware = function onlyAuth(ctx, next) {

  const { hasLogin = false } = ctx.state;

  if (!hasLogin) thrower.unauthorizedError('请登录后再访问');

  return next();
};

export const allowCROS: Middleware = function allowCROS(ctx, next) {
  ctx.res.setHeader('Access-Control-Allow-Origin', '*');
  ctx.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,DELETE,OPTIONS,PATCH');
  ctx.res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');


  return next();
}


export function parseJWT(): Middleware {
  return (ctx, next) => {

    const { authorization: rawToken = '' } : { authorization : string } = ctx.request.header;

    const token = rawToken.replace('Bearer ', '');

    ctx.state.token = token;

    return next();
  }
}

export function decodeJWT(): Middleware {
  return (ctx, next) => {
    const secret = serverConfig.secret;
    const { token = '' } : { token: string } = ctx.state;

    try {
      jwt.verify(token, secret);
      const user = jwt.decode(token);
      ctx.state.hasLogin = true;
      ctx.state.user = user;
    } catch (err) {
      ctx.state.hasLogin = false;
      ctx.state.user = null;
    }


    return next();
  };
}
