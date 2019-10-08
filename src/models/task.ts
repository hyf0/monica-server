import { Schema, SchemaTypes } from 'mongoose';

const task = new Schema({
    id: {
      type: String,
      unique: true,
      required: true,
    },
    owner: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      default: Date.now,
      required: true,
    },
    items: {
      type: Array,
      default: [],
    },
    isPinned: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastVisitTime: {
      type: Number,
      default: Date.now,
    },
});

export interface ModelTask {
    id: string;
    owner: string;
    title: string;
    timestamp: number;
    items: any[];
    isPinned: boolean;
    lastVisitTime: number;
}

export default task;
