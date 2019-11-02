import { Router } from 'express';

const healthCheckRouter = Router();

healthCheckRouter.get('/', (req, res) => res.json({ status: 'Up', time: new Date() }));

export default healthCheckRouter;
