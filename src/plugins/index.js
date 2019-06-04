'use strict';

var validate = credentials => {
  // Run any checks here to confirm we want to grant these credentials access
  return {
    isValid: true,
    credentials, // request.auth.credentials
  };
};

module.exports.register = async server => {
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: 'NeverShareYourSecret', // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
  });

  server.auth.default('jwt');
};
