import projectTypeDefs from './project';
import taskTypeDefs from './task';
import userTypeDefs from './user';
import { gql } from 'apollo-server-koa';

const rootTypeDefs = gql`
  type Mutation {
    root: String
  }
  type Query {
    root: String
  }
`;

const typeDefs = [rootTypeDefs, projectTypeDefs, taskTypeDefs, userTypeDefs];

export default typeDefs;
