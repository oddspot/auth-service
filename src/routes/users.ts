import { Router } from 'express';
import { UsersController } from '../controllers';

const userRouter = Router();

userRouter.post('/', UsersController.register);

export default userRouter;
