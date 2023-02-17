import { Schema, model } from 'mongoose';

const User = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', User);
