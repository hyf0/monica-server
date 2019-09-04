import { connect, model } from 'mongoose';
import { getServerConfig } from '../config/server';

import user from './user';
import task from './task';
// import item from './item';

const config = getServerConfig();

function createConnect(dbUrl: string) {
    return function connectToDatabase () {
        return connect(dbUrl, {
            useNewUrlParser: true,
        })
    };
}

export const connectDb = createConnect(config.dbUrl);

// model

export const User = model('User', user);
export const Task = model('Task', task);
// export const Item = model('Item', item);
