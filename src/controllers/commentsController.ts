import User from '../models/User';
import Comment from '../models/Comment';
import { RequestWithUser } from '../middlewares/authMiddleware';
import { Request, Response } from 'express';
import { ApiError } from '../exceptions/apiError';

export const createComment = async (req: RequestWithUser, res: Response) => {
  const comment = await Comment.create(req.body);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { comments: comment._id }
    },
    {
      new: true,
    }
  );

  return res.json({ data: comment });
}

export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true });

  if (!comment) {
    throw ApiError.NotFound();
  }

  await comment.save();

  return res.json({ data: comment });
}

export const getAllComments = async (req: Request, res: Response) => {
  const comments = await Comment.find();

  return res.status(200).json({
    size: comments.length,
    data: comments,
  });
}

export const deleteComment = async (req: Request, res: Response) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    throw ApiError.NotFound();
  }

  await comment.remove();

  return res.status(204).send();
}
