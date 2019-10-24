import projectResolvers from './project';
import userResolvers from './user';
import tasktResolvers from './task';

import R from 'ramda';

const resolverList = [projectResolvers, userResolvers, tasktResolvers];

const resolvers = (resolverList as any[]).reduce(R.mergeDeepLeft);

export default resolvers;

console.log('resolvers', resolvers);
