import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { IResolverContext } from '../..';
import R from 'ramda';
import { IUserDocument } from '../Model/user';
import Model from '../Model';
import serverConfig from '../serverConfig';

export async function settingLoginStatus(
  resolverContext: IResolverContext,
  ctx: Context,
): Promise<IResolverContext> {
  const {
    authorization: rawToken = '',
  }: { authorization: string } = ctx.request.header;
  const token = rawToken.replace('Bearer ', '');
  try {
    jwt.verify(token, serverConfig.secret);

    const { username }: { username: string } = jwt.decode(token) as {
      username: string;
    };

    const user = (await Model.User.findOne({
      username,
    })) as IUserDocument | null;

    if (user == null) throw new Error('校验jwt错误，查找用户失败');

    const newContext: IResolverContext = R.merge(resolverContext, {
      user: user,
      isLogined: true,
    });
    // console.log(user && user.toObject(), `已经登录`);
    return newContext;
  } catch (err) {
    return resolverContext;
  }
}
