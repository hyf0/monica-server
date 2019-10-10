import { projectTypeDefs, projectResolvers } from './Project';
import { taskTypeDefs, tasktResolvers } from './Task';
import { userTypeDefs, userResolvers } from './User';
import { gql } from 'apollo-server-koa';
import R from 'ramda';

const rootTypeDefs = gql`
  type Mutation {
    root: String
  }
  type Query {
    root: String
  }
`;

export const typeDefs = [rootTypeDefs, projectTypeDefs, taskTypeDefs, userTypeDefs];

const resolverList = [
  projectResolvers,
  userResolvers,
  tasktResolvers,
];

export const resolvers = (resolverList as any[]).reduce(R.mergeDeepLeft);

console.log('resolvers', resolvers);
