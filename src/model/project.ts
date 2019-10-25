import { Schema, Document } from 'mongoose';

const project = new Schema({
    name: {
        type: String,
        required: true,
      },
    ownerId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: Date.now,
      required: true,
    },
    isPinned: {
      type: Boolean,
      required: true,
      default: false,
    },
}, {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  }
});

project.virtual('id').get(function(this: Document) {
  return this._id.toString();
});

export interface IProjectDocument extends Document {
  id: string;
  ownerId: string;
  name: string;
  timestamp: number;
  isPinned: boolean;
}


export default project;
