import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { User } from '../lib/model';
import { IResolverContext } from '../..';
import R from 'ramda';
import { IUserDocument } from '../lib/model/user';
export async function settingLoginStatus(resolverContext: IResolverContext, ctx: Context): Promise<IResolverContext> {
  const { authorization: rawToken = '' } : { authorization: string } = ctx.request.header;
  const token = rawToken.replace('Bearer ', '');
  try {
    jwt.verify(token, secret);
    const { username }: { username: string } = jwt.decode(token) as { username: string };
    const user = await User.findOne({ username }) as IUserDocument | null;
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

