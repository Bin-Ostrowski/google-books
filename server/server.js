const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');

//import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
//import Authentication middleware
const { authMiddleware } = require("./utils/auth");

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express(); 


//create new Apollo server and pass in schema data and auth middleware
// ensures every request performs an authentication check,
// and updated request object is passed to the resolvers as context.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Serve up static assets
//check to see if Node environment is in production. Express serve React application's build directory in the 
//client folder.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//if a GET request doesn't have route defined, respond with production-ready React front-end code.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// create new instance of Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate Apollo server with Express application as middleware
  server.applyMiddleware({ app });

  //run server 
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// call async function to start the server
startApolloServer(typeDefs, resolvers);


