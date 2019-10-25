import { Schema, Document } from 'mongoose';

const user = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

user.virtual('id').get(function(this: Document) {
  return this._id.toString();
});

export interface IUserDocument extends Document {
  _id: any;
  id: string;
  username: string;
  password: string;
}

export default user;
