const { first, pick } = require('lodash');
const auth = require('./auth')();
const googleAuth = require('./google-auth')();

const getToken = ({ email }) => auth.getToken({ email });

module.exports = {
  Query: {
    allUsers: async (root, data, { mongo: { Users } }) => {
      return await Users.find().toArray();
    },
    supersecret: async (root, data, { authorization }) => {
      try {
        const verified = auth.verify(authorization);
        console.log({ authorization, verified });
  
        return await 'much-secret';
      } catch(err) {
        return 'nope';
      }
    }
  },
  Mutation: {
    signInGoogle: async (root, { token }, { mongo: { Users } }) => {
      const user = await googleAuth.verify(token);

      const existingUser = await Users.findOne({ email: user.email });
      if(existingUser) {
        console.log('User already exists');

        return {
          token: getToken(existingUser),
          user: existingUser
        };
      }

      const newUser = pick(user, 'email', 'name', 'picture');

      const { insertedIds } = await Users.insert(newUser);
      
      return {
        user: Object.assign({ id: first(insertedIds) }, newUser),
        token: getToken(newUser)
      };
    }
  },
  User: {
    id: ({ _id, id }) => _id || id
  }
};
