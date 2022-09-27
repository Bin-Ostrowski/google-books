import { gql } from "@apollo/client";

// logged-in user query
export const QUERY_ME = gql`
{
    me {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      description
      title
      image
      link
    }
  }
}
`