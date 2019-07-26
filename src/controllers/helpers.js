'use strict';

const Boom = require('boom');
const { Ability } = require('@casl/ability');

// проверка прав
// rules - правила в формате CASL
// action - насвание проверяемой акции
// objectName - название проверяемого объекта
function implCheckAbility(rules, action, objectNamesArr) {
  const ability = new Ability(rules);
  const isGranted = objectNamesArr.reduce((res, currentItem) => res || ability.can(action, currentItem), false);
  if (!isGranted) {
    throw Boom.forbidden(`Не достаточно прав на действие <${action}> для объекта [${objectNamesArr}]!`);
  }
}

// function implCheckAbility(rules, action, objectName) {
//   const ability = new Ability(rules);
//   if (ability.cannot(action, objectName)) {
//     throw Boom.forbidden(`Запрещено действие <${action}> для объекта [${objectName}]!`);
//   }
// }

module.exports = {
  checkAbility(action, objectName) {
    return (request, h) => {
      if (Array.isArray(objectName)) {
        implCheckAbility(request.auth.credentials.rules, action, objectName);
      } else {
        implCheckAbility(request.auth.credentials.rules, action, [objectName]);
      }
      return request;
    };
  },
};
