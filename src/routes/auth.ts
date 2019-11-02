import { Router } from 'express';
import { AuthController } from '../controllers';
import { checkJwt } from '../middlewares/checkJwt';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/change-password', [checkJwt], AuthController.changePassword);
authRouter.get('/verify-account', AuthController.verifyAccount);

export default authRouter;
