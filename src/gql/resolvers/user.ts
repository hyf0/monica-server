import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-koa';
import Model from '../../model';

import { IResolverContext } from '../../..';
import { IUserDocument } from '../../model/user';
import { IProjectDocument } from '../../model/project';
import serverConfig from '../../serverConfig';
const { User, Project, Task } = Model;

function usernameValidator(username: string) {
  //用户名正则，4到16位（字母，数字，下划线，减号）
  const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
  return pattern.test(username);
}

function passwordValidator(password: string) {
  //密码正则，4到16位（字母，数字，下划线，减号）
  const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
  return pattern.test(password);
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
      _: unknown,
      args: {
        loginStatus: null | {
          username: string;
          password: string;
        };
      },
      ctx: IResolverContext,
    ) {
      const { loginStatus } = args;
      let { user: ctxUser } = ctx;
      if (loginStatus == null && ctxUser == null)
        throw new AuthenticationError('未检测到登录信息');

      if (loginStatus != null) { // 优先响应使用了账号密码的登录请求
        const { username, password } = loginStatus;
        if (!usernameValidator(username) || !passwordValidator(password))
          throw new Error('账号或密码格式错误');

        const user = (await User.findOne({
          username,
          password,
        })) as IUserDocument | null;

        if (user == null)
          throw new AuthenticationError('用户不存在，或账号密码错误');

        const jwtoken = jwt.sign({ username }, serverConfig.secret);
        return {
          user: user.toObject(),
          token: {
            raw: jwtoken,
          },
        };
      }
      if (ctxUser !== null) { // 使用了 token 的登录
        const { username } = ctxUser;
        const tokenContent = jwt.sign({ username }, serverConfig.secret);
        return {
          user: ctxUser.toObject(),
          token: {
            raw: tokenContent,
          },
        };
      }
    },
  },
  Mutation: {
    async register(
      prev: unknown,
      args: {
        username: string;
        password: string;
      },
    ): Promise<unknown> {
      const { username, password } = args;
      if (!usernameValidator(username) || !passwordValidator(password))
        throw new Error('账号或密码格式错误');

      let user = (await User.findOne({
        username,
      })) as IUserDocument | null;

      if (user != null) throw new AuthenticationError('用户已经存在');

      user = (await User.create({
        username,
        password,
      })) as IUserDocument;

      // 默认项目
      const defaultProject = (await Project.create({
        ownerId: user.id,
        isPinned: true,
        name: '创建一个项目',
      })) as IProjectDocument;
      await Promise.all([
        Task.create({
          name: '项目创建：在侧边栏下方输入项目名字，按下回车创建项目',
          projectId: defaultProject.id,
        }),
        Task.create({
          name: '删除项目：点击侧边栏的编辑按钮，点击删除图标即可',
          projectId: defaultProject.id,
        }),
        Task.create({
          name:
            '添加任务：在编辑任务界面，在编辑框中输入任务名，按下回车即可创建',
          projectId: defaultProject.id,
        }),
        Task.create({
          name: '删除任务：在编辑任务界面，点击右侧删除图标',
          projectId: defaultProject.id,
        }),
      ]);

      const jwtoken = jwt.sign({ username }, serverConfig.secret);
      return {
        user: user.toObject(),
        token: {
          raw: jwtoken,
        },
      };
    },
  },
};
