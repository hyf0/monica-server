import Router from 'koa-router';
import users from '../controllers/users';
import { onlyAuth } from '../middleware';

const usersRouter = new Router({ prefix: '/users' });

usersRouter.get('/', onlyAuth, users.read);

usersRouter.post('/', users.register);

// usersRouter.post('/:id', users.register);

usersRouter.post('/login', users.login);


export default usersRouter;
