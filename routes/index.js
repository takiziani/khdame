import { Router } from "express";
import usersRouter from './users.js';
import stockRouter from './stock.js';
import sellRouter from './sell.js';
import statisticRouter from './statistic.js'
const router = Router();
router.use(usersRouter);
router.use(stockRouter);
router.use(sellRouter);
router.use(statisticRouter);
export default router;