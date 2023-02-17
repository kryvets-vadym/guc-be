import * as authController from '../controllers/authController';
import { Router } from 'express';
import { catchErrors } from '../helpers/catchErrors';

const router = Router();

router.post('/registration', catchErrors(authController.registration));
router.post('/login', catchErrors(authController.login));
router.post('/logout', catchErrors(authController.logout));
router.get('/refresh', catchErrors(authController.refresh));

export default router;
