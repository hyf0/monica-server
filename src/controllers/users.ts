import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { validateProps, uniqueId } from '../utils';
import { User, Task } from '../models';
import { ModelUser } from '../models/user';
import { getServerConfig } from '../config/server';
import { ModelTask } from '../models/task';
import { thrower } from '../middleware/errors';


const NOBODY = '@__nobody';

const serverConfig = getServerConfig();

const usernamePattern = /^[a-zA-Z0-9_-]{4,16}$/;
const passwordPattern = /^[a-zA-Z0-9_-]{4,16}$/;

const getOneDefaultTask = (owner: string): ModelTask => ({
  id: uniqueId(),
  owner,
  title: '创建一个任务',
  timestamp: Date.now(),
  isPinned: false,
  lastVisitTime: Date.now(),
  items: [
    {
      id: uniqueId(),
      title: '创建任务: 在侧菜单栏中的输入框内按回车',
      checked: false,
    },
    {
      id: uniqueId(),
      title: '编辑任务: 在侧菜单栏中打开编辑模式',
      checked: false,
    },
    {
      id: uniqueId(),
      title: '添加任务项: 打开编辑模式后，点击编辑按钮',
      checked: false,
    },
    {
      id: uniqueId(),
      title: '保存: 每次编辑后，程序会自动保存',
      checked: false,
    },
    {
      id: uniqueId(),
      title: '开始一项任务: 在非编辑模式下点击任务即可',
      checked: false,
    },
  ],
});

class Users {
  login = async (ctx: Context) => {
    const body = ctx.request.body;
    validateProps(body, {
      username: 'string',
      password: 'string',
    });
    const {
      username = NOBODY,
      password = ''
    }: { username: string; password: string } = body;

    const user = await User.findOne({ username, password }).lean();

    if (user == null) thrower.notFoundError('未找到用户，用户名或密码错误');

    ctx.status = 200;
    ctx.body = {
      user: user,
      token: jwt.sign(user, serverConfig.secret),
    }
  }

  register = async (ctx: Context) => {
    const body = ctx.request.body;
    validateProps(body, {
      username: 'string',
      password: 'string',
    });
    const {
      username ,
      password
    }: { username: string; password: string } = body;

    //todo - 检查用户名和密码字符是否合法 比如只能数字加英文和一些符号

    if (!usernamePattern.test(username) || !passwordPattern.test(password)) {
      thrower.unauthorizedError('非法用户名或密码');
    }

    let findUser: ModelUser = await User.findOne({username}).lean();

    if (findUser != null) thrower.conflictError('用户名已经被注册');

    const user = new User({
      username,
      password,
    });

    Object.assign(ctx.request, user.toObject());

    const oneDefaultTask = new Task(getOneDefaultTask(user._id));

    await Promise.all([user.save(), oneDefaultTask.save()]);

    await this.login(ctx);

    // await Promise.all([user.save(), this.login(ctx)])
  }

  read = async (ctx: Context) => {
    const owner: ModelUser = ctx.state.user;
    const user = await User.findById(owner._id).lean();
    ctx.status = 200;
    ctx.body = user;
  }

}

export default new Users();
