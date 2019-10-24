import { Schema, Document } from 'mongoose';

const task = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: Date.now,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

task.virtual('id').get(function(this: Document) {
  return this._id.toString();
});

export interface ITaskDocument extends Document {
  id: string;
  name: string;
  projectId: string;
  timestamp: number;
  checked: boolean;
}

export default task;
