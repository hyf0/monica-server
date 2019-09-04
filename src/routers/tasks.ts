import Router from 'koa-router';
import tasks from '../controllers/tasks';
import { onlyAuth } from '../middleware';

const tasksRouter = new Router({ prefix: '/tasks' });

// create

tasksRouter.post('/', onlyAuth, tasks.create);

// read

tasksRouter.get('/', onlyAuth, tasks.getTaskList);

tasksRouter.get('/:id', onlyAuth, tasks.read);

// update

tasksRouter.put('/:id', onlyAuth, tasks.update);

//delete

tasksRouter.delete('/:id', onlyAuth, tasks.remove);


export default tasksRouter;
