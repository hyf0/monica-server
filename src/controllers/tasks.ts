import { Context } from 'koa';

import { validateProps } from '../utils';
import { ModelUser } from '../models/user';
import { Task } from '../models';
import { thrower } from '../middleware/errors';

class Tasks {
  create = async (ctx: Context) => {
    const reqBody = ctx.request.body;
    validateProps(reqBody, {
      title: 'string',
      id: 'string',
      timestamp: 'number'
    });

    const owner: ModelUser = ctx.state.user;

    const task = new Task({
      ...reqBody,
      owner: owner._id
    });

    await task.save();
    ctx.status = 201;
    ctx.body = task.toObject();
  };

  remove = async (ctx: Context) => {
    const owner: ModelUser = ctx.state.user;
    const params = ctx.params;
    validateProps(params, {
      id: 'string'
    });
    const { id: taskId } = params;

    await Task.findOneAndDelete({ id: taskId, owner: owner._id });
    ctx.status = 204;
    // ctx.body = task.toObject();
  };

  update = async (ctx: Context) => {
    const owner: ModelUser = ctx.state.user;
    const params = ctx.params;
    validateProps(params, {
      id: 'string'
    });
    const reqBody = ctx.request.body;
    validateProps(reqBody, {
      id: 'string',
      title: 'string',
      timestamp: 'number',
      owner: 'string'
    });

    const { id: taskId } = params;
    const { timestamp } = reqBody;

    const task = reqBody;

    const updatedTask = await Task.findOneAndUpdate(
      { id: taskId, owner: owner._id, timestamp: { $lte: timestamp } },
      task,
      { new: true }
    ).lean();
    console.log('updatedTask', updatedTask);
    if (updatedTask == null) thrower.badRequestError('更新任务信息失败');
    ctx.status = 200;
    ctx.body = updatedTask;
  };

  read = async (ctx: Context) => {
    const owner: ModelUser = ctx.state.user;
    const params = ctx.params;
    validateProps(params, {
      id: 'string'
    });
    const { id: taskId } = params;
    const task = await Task.findOneAndUpdate(
      { id: taskId, owner: owner._id },
      {
        lastVisitTime: Date.now(),
      },
      { new: true }
    ).lean();
    if (task == null) thrower.notFoundError('你访问的任务不存在');

    ctx.status = 200;
    ctx.body = task;

  };

  getTaskList = async (ctx: Context) => {
    const owner: ModelUser = ctx.state.user;
    const taskList = await Task.find({
      owner: owner._id
    }).lean();

    ctx.status = 200;
    ctx.body = taskList;
  };
}

export default new Tasks();
