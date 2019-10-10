import { ForbiddenError, AuthenticationError } from 'apollo-server-koa';
import { IResolverContext } from '../../../..';
import { Project, Task } from '../../model';
import { IProjectDocument } from '../../model/project';
import { ITaskDocument } from '../../model/task';

export default {
  Task: {
    async project(prev: { projectId: string }) {
      const { projectId } = prev;
      const project = await Project.findById(projectId) as IProjectDocument | null;
      return project && project.toObject();
    }
  },
  Mutation: {
    async addTask(
      prev: undefined,
      args: { projectId: string; name: string },
      ctx: IResolverContext,
    ) {
      const { user } = ctx;
      if (user == null) throw new AuthenticationError('请登录');
      const { projectId, name } = args;
      const project = (await Project.findById(
        projectId,
      )) as IProjectDocument | null;
      if (project == null) throw new ForbiddenError('未找到对应的 project');
      if (project.ownerId !== user.id)
        throw new AuthenticationError('错误登录信息，创建 task 冲突');
      const task = (await Task.create({
        projectId,
        name,
      })) as ITaskDocument;
      return task.toObject();
    },
    async delTask(
      prev: undefined,
      args: { id: string },
      ctx: IResolverContext,
    ) {
      const { user } = ctx;
      if (user == null) throw new AuthenticationError('请登录');
      const { id: taskId } = args;
      const task = (await Task.findByIdAndDelete(
        taskId,
      )) as ITaskDocument | null;
      return task && task.toObject();
    },
  },
};
