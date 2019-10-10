import { gql } from 'apollo-server-koa';

export default gql`
  type Project {
    id: ID
    name: String
    timestamp: String
    isPinned: Boolean
    owner: User
    tasks: [Task]!
  }

  extend type Query {
    projects(username: String!): [Project]!
    project(id: String!): Project
  }

  extend type Mutation {
    addProject(name: String!): Project
    delProject(id: String!): Project
  }
  
`;
