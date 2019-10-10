import { AuthenticationError } from 'apollo-server-koa';
import { IResolverContext } from '../../../..';
import { Project, User, Task } from '../../model';
import project from '../../model/project';
import { ITaskDocument } from '../../model/task';

const resolvers = {
  Project: {
    async owner(prev: { ownerId: string }) {
      const { ownerId } = prev;
      const user = await User.findById(ownerId);
      if (user == null) return null;
      return user.toObject();
    },
    async tasks(prev: { id: string }) {
      const { id: projectId } = prev;
      const tasks= await Task.find({
        projectId,
      }) as ITaskDocument[];
      console.log('tasks');
      return tasks.map(t => t.toObject());
    }
  },
  Mutation: {
    async addProject(
      prev: undefined,
      args: {
        name: string;
      },
      ctx: IResolverContext,
    ) {
      const { name } = args;
      const { user } = ctx;
      if (user == null) throw new AuthenticationError('未登录');
      const project = await Project.create({
        name,
        ownerId: user.id,
      });
      return project.toObject();
    },
    async delProject(
      prev: undefined,
      args: {
        id: string;
      },
      ctx: IResolverContext,
    ) {
      const { id: projectId } = args;
      const { user } = ctx;
      if (user == null) throw new AuthenticationError('未登录');
      const project = await Project.findOneAndDelete({
        _id: projectId,
        ownerId: user.id,
      });
      if (project == null)
        throw new AuthenticationError('删除失败，或非法删除');
      return project.toObject();
    },
  },
  Query: {
    async projects(
      root: any,
      args: {
        username: string;
      },
      ctx: IResolverContext,
    ) {
      const { username } = args;
      const { user } = ctx;
      if (user == null || user.username !== username)
        throw new AuthenticationError('未登录，或非法操作');
      return await Project.find({
        ownerId: user.id,
      });
    },
    async project(prev: any, args: { id: string }, ctx: IResolverContext) {
      const { id: projectId } = args;
      const { user } = ctx;
      if (user == null) throw new AuthenticationError('未登录');
      const project = await Project.findOne({
        _id: projectId,
        ownerId: user.id,
      });
      return project && project.toObject();
    },
  },
};

export default resolvers;
