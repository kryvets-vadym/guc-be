import { authMiddleware } from '../middlewares/authMiddleware';
import { catchErrors } from '../helpers/catchErrors';
import * as commentsController from '../controllers/commentsController';
import { Router } from 'express';

const router = Router();

router.post('/comments',
  authMiddleware,
  catchErrors(commentsController.createComment)
);
router.put('/comments/:id',
  authMiddleware,
  catchErrors(commentsController.updateComment)
);
router.delete('/comments/:id',
  authMiddleware,
  catchErrors(commentsController.deleteComment)
);
router.get('/comments',
  authMiddleware,
  catchErrors(commentsController.getAllComments)
);

export default router;
