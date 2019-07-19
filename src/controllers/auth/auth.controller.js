'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/auth/user.dal');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line no-unused-vars
const { AbilityBuilder, Ability } = require('@casl/ability');

const CaslRules1 = [
  {
    actions: ['read'],
    subject: ['all'],
  },
];
const CaslRules2 = [
  {
    actions: ['read'],
    subject: ['all'],
  },
  {
    actions: ['read', 'delete'],
    subject: ['Country'],
  },
];

module.exports = {
  // Создать нового пользователя
  async register(request, h) {
    const user = request.payload;
    user.enabled = true;
    let result = await Bcrypt.hash(user.password, 14).catch(err => {
      return Boom.badImplementation(err.message);
    });
    // проверка что хеш создался нормально
    if (Boom.isBoom(result)) {
      return result;
    }

    user.password = result;
    result = await Dal.create(user).catch(err => {
      return Boom.badRequest(err.message);
    });
    result.password = null; // нельзя возвращать хеш пароля
    return result;
  },

  // вход(login)
  async login(request, h) {
    // eslint-disable-next-line no-unused-vars
    const { rules, can, cannot } = AbilityBuilder.extract();
    can('read', 'all');
    can('manage', 'Post', { author: 'me' });
    cannot('delete', 'Post');
    // eslint-disable-next-line no-unused-vars
    const aaa = new Ability(CaslRules1);

    const { name, password } = request.payload;
    const user = await Dal.findByName(name).catch(err => {
      return Boom.badRequest(err.message);
    });
    // проверка что нашли пользователя
    if (Boom.isBoom(user)) {
      return user;
    } else if (!user) {
      return Boom.badRequest('Неверные логин или пароль.');
    } else if (!user.enabled) {
      return Boom.badRequest('Пользователь деактивирован. Обратитесь к администратору системы.');
    }

    // проверка пароля
    const result = await Bcrypt.compare(password, user.password)
      .then(res => {
        if (res) {    // пароль верен
          const credential = { id: user.id, rules: CaslRules2 };
          // const token = jwt.sign(credential, this.jwt_key, { algorithm: 'HS256', expiresIn: '1h' });
          const token = jwt.sign(credential, this.jwt_key, { algorithm: 'HS256' });
          return { name: name, access_token: token, rules: CaslRules2 };
        } else {
          return Boom.badRequest('Неверные логин или пароль.');
        }
      })
      .catch(err => {
        return Boom.badRequest(err.message);
      });
    return result;
  },
};
