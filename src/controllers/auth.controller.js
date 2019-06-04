'use strict';

const Boom = require('boom');
const Dal = require('../models/dal/auth.dal');
const Bcrypt = require('bcrypt');

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
    return result;
  },

  // вход(login)
  async login(request, h) {
    const { name, password } = request.payload;
    let result = await Dal.findByName(name).catch(err => {
      return Boom.badRequest(err.message);
    });
    // проверка что нашли пользователя
    if (Boom.isBoom(result)) {
      return result;
    } else if (!result) {
      return Boom.badRequest('Неверные логин или пароль.');
    } else if (!result.enabled) {
      return Boom.badRequest('Пользователь деактивирован. Обратитесь к администратору системы.');
    }

    // проверка пароля
    result = await Bcrypt.compare(password, result.password)
      .then(res => {
        if (res) {
          return { name: name, access_token: 'good' };
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
