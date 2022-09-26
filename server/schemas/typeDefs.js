const { gql } = require("apollo-server-express");

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    # Not the _id, but the book's id value returned from Google's Book API.)??????
    bookId: ID
    #(An array of strings, as there may be more than one author.)??? 
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }


# define saveBook input type
input SaveBookInput {
        author: [String]
        description: String 
        title: String! 
        bookId: String!
        image: String 
        link: String
}


type Auth {
    token: ID!
    user: User
  }
  
type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: SaveBookInput!): User
    removeBook(bookId: String!): User
  }

`;

//export typeDefs
module.exports = typeDefs;
