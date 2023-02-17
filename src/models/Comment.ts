import { Schema, model } from 'mongoose';

const Comment = new Schema(
  {
    body: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Comment', Comment);
