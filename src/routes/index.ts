import { Router } from 'express';
import healthCheckRouter from './healthCheck';
import usersRouter from './users';
import authRouter from './auth';

const router = Router();

router.use('/healthcheck', healthCheckRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;
