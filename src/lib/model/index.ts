import { connect, model } from 'mongoose';
// import { getServerConfig } from '../config/server';

import user from './user';
import task from './task';
import project from './project';

function createConnect(dbUrl: string) {
  return function connectToDatabase() {
    return connect(
      dbUrl,
      {
        useNewUrlParser: true,
        // useFindAndModify: true,
        useUnifiedTopology: true,
      },
    );
  };
}

export default {
  connect: createConnect('mongodb://127.0.0.1:27017/ross'),
  Project: model('Project', project),
  User: model('User', user),
  Task: model('Task', task),
};

export const Project = model('Project', project);
export const User = model('User', user);
export const Task = model('Task', task);