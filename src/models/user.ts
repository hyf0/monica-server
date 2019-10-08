import { Schema } from 'mongoose';

import { ModelTask } from './task';

const user = new Schema({
    username: {
      type: String,
      unique: true,
    },
    password: {
        type: String,
        select: false,
    },
    // tasks: {
    //     type: [{
    //       type: SchemaType.
    //     }],
    //     required: true,
    //     default: [],
    // }
});

export interface ModelUser {
    _id: any,
    username: string;
    password: string;
    tasks: ModelTask[],
}

export default user;
