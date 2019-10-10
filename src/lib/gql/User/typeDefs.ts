import { gql } from 'apollo-server-koa';

export default gql`
  type User {
      id: ID
      username: String
      projects: [Project]!
  }

  type JWToken {
    raw: String!
  }

  type LoginRes {
    user: User
    token: JWToken!
  }

  extend type Query {
    login(username: String!, password: String!): LoginRes! # return JWToken
  }

  extend type Mutation {
    register(username: String!, password: String!): LoginRes! # return JWToken
  }
  
`;
