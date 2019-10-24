import { gql } from 'apollo-server-koa';

export default gql`
  type Task {
      id: ID
      name: String
      checked: Boolean
      project: Project
      timestamp: String
  }

  extend type Mutation {
    addTask(projectId: String!, name: String!): Task!
    delTask(id: String!): Task!
  }
`;
