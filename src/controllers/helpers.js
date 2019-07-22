'use strict';

const Boom = require('boom');
const { Ability } = require('@casl/ability');

module.exports = {
  // проверка прав
  // rules - правила в формате CASL
  // action - насвание проверяемой акции
  // objectName - название проверяемого объекта
  checkAbility(rules, action, objectName) {
    const ability = new Ability(rules);
    if (ability.cannot(action, objectName)) {
      return Boom.forbidden(`Запрещено действие <${action}> для обекта [${objectName}]!`);
    } else {
      return null;
    }
  },
};
