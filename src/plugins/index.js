'use strict';

// node - e "console.log(require('crypto').randomBytes(256).toString('base64'));"
const JWT_KEY = 'NeverShareYourSecret';

var validate = async function(decoded, request) {
  // Run any checks here to confirm we want to grant these credentials access
  return {
    isValid: true,
    decoded, // request.auth.credentials
  };
};

module.exports.register = async server => {
  await server.register(require('hapi-auth-jwt2'));

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_KEY, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
  });

  server.auth.default('jwt');
  server.bind({ jwt_key: JWT_KEY });
};
