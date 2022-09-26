const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    //JWT read the request headers
    me: async (_, args, context) => {
      // check for the existence of context.user. If no context.user property exists, then
      // we know that the user isn't authenticated and we can throw an AuthenticationError
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    // createUser
    addUser: async (_, args) => {
      const user = await User.create(args);
      // sign a token
      const token = signToken(user);

      //return an object that combines the token with the user's data
      return { token, user };
    },

    // login
    login: async (_, { email, password }) => {
      //validate email
      const user = await User.findOne({ email });

      if (!user) {
        //dont specify which is incorrect to shield from malicious hackers
        throw new AuthenticationError("Incorrect credentials");
      }

      //validate user password
      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      //sign a token
      const token = signToken(user);
      //return an object that combines the token with the user's data
      return { token, user };
    },

    saveBook: async (_, { bookData }, context) => {
        if (context.user) {
          const updateUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: bookData } },
            { new: true, runValidators: true }
          );
  
          return updateUser;
        }
  
        throw new AuthenticationError('You need to be logged in!');
      },



    //removeBook
    removeBook: async (_, { bookId }, context) => {
        if (context.user) {
            const updateUser = await User.findOneAndUpdate(
              { _id: context.user._id  },
              { $pull: { savedBooks: { bookId: bookId } } },
              { new: true }
            );
    
            return updateUser;
          }
    
          throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
