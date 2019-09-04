import { Schema } from 'mongoose';

const item = new Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  title: String,
  checked: Boolean,
  timestamp: {
      type: Date,
      default: Date.now,
  },
});

export interface ModelItem {
    title: string;
    checked: boolean;
}

export default item;
