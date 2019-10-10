import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-koa';
import { User, Project } from '../../model';
import { IResolverContext } from '../../../..';

const salt = 'hello';

interface LoginRes {
  user: object;
  token: {
    raw: string;
  };
}

export default {
  User: {
    async projects(prev: { id: string }) {
      const { id: userId } = prev;
      const projects = await Project.find({
        ownerId: userId,
      });
      return projects.map(p => p.toObject());
    },
  },
  Query: {
    async login(
      root: any,
      args: {
        username: string;
        password: string;
      },
    ): Promise<LoginRes> {
      const { username, password } = args;
      const user = await User.findOne({
        username,
        password,
      });
      if (user == null)
        throw new AuthenticationError('用户不存在，或账号密码错误');

      const tokenContent = jwt.sign({ username }, salt);

      return {
        user: user.toObject(),
        token: {
          raw: tokenContent,
        },
      };
    },
  },
  Mutation: {
    async register(
      root: any,
      args: {
        username: string;
        password: string;
      },
    ): Promise<LoginRes> {
      const { username, password } = args;
      let user = await User.findOne({
        username,
      });
      if (user != null) throw new AuthenticationError('用户已经存在');
      user = await User.create({
        username,
        password,
      });
      const tokenContent = jwt.sign({ username }, salt);
      return {
        user: user.toObject(),
        token: {
          raw: tokenContent,
        },
      };
    },
  },
};
