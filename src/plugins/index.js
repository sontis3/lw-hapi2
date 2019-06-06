'use strict';

// node - e "console.log(require('crypto').randomBytes(256).toString('base64'));"
const JWT_KEY = 'NeverShareYourSecret';
const Dal = require('../models/dal/auth.dal');

var validate = async function(decoded, request) {
  // проверка на наличие такого активного пользователя
  const result = await Dal.findById(decoded.id)
    .then(res => {
      if (res.enabled) {
        return { isValid: true };
      } else {
        return { isValid: false };
      }
    })
    .catch(_err => {
      return { isValid: false };
    });
  return result;
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
