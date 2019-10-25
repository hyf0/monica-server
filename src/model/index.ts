import { connect, model } from 'mongoose';
// import { getServerConfig } from '../config/server';

import user from './user';
import task from './task';
import project from './project';

function connectToDatabase(dbUrl: string) {
  return connect(
    dbUrl,
    {
      useNewUrlParser: true,
      // useFindAndModify: true,
      useUnifiedTopology: true,
    },
  );
}

// function createConnect(dbUrl: string) {
//   return function connectToDatabase() {
//     return connect(
//       dbUrl,
//       {
//         useNewUrlParser: true,
//         // useFindAndModify: true,
//         useUnifiedTopology: true,
//       },
//     );
//   };
// }

export const db = {
  connect: connectToDatabase,
}

export default {
  Project: model('Project', project),
  User: model('User', user),
  Task: model('Task', task),
};

// export const Project = model('Project', project);
// export const User = model('User', user);
// export const Task = model('Task', task);
