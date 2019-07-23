'use strict';

const Boom = require('boom');
const { Ability } = require('@casl/ability');

// проверка прав
// rules - правила в формате CASL
// action - насвание проверяемой акции
// objectName - название проверяемого объекта
function implCheckAbility(rules, action, objectName) {
  const ability = new Ability(rules);
  if (ability.cannot(action, objectName)) {
    throw Boom.forbidden(`Запрещено действие <${action}> для обекта [${objectName}]!`);
  }
}

module.exports = {
  checkAbility(action, objectName) {
    return (request, h) => {
      implCheckAbility(request.auth.credentials.rules, action, objectName);
      return request;
    };
  },
};
