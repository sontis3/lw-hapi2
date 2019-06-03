'use strict';

const Boom = require('boom');
const Dal = require('../models/dal/auth.dal');
const Bcrypt = require('bcrypt');

module.exports = {
  // Получить список пользователей.
  // description: По умолчанию все пользователи.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Boom.badRequest(err.message);
      });
    return result;
  },

  // Создать нового пользователя
  async register(request, h) {
    const user = request.payload;
    user.enabled = true;
    user.password = await Bcrypt.hash(user.password, 15).catch(err => {
      return Boom.badImplementation(err.message);
    });
    const result = await Dal.create(user)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Boom.badRequest(err.message);
      });
    return result;
  },

  // найти пользователя
  async findOne(request, h) {
    return Boom.notImplemented();
  },

  // изменить пользователя
  async update(request, h) {
    const id = request.params.id;
    const user = request.payload;
    if (!user) {
      return Boom.badData('No user request data');
    }

    // const appModel = automapper.map('ApiCustomer', 'Customer', customer);

    let result = await Dal.update(id, user)
      .then(dbResult => {
        if (dbResult === null) {
          return Boom.notFound(`Документ с id=${id} не найден!`);
        }
        return dbResult;
        // return h.response(dbResult).code(204);
      })
      .catch(err => {
        if (err.name === 'CastError') {
          return Boom.notFound(err.message);
        } else {
          return Boom.badRequest(err.message);
        }
      });
    return result;
  },

  // удалить пользователя
  async delete(request, h) {
    const id = request.params.id;
    let result = await Dal.delete(id)
      .then(dbResult => {
        if (dbResult === null) {
          return Boom.notFound(`Документ с id=${id} не найден!`);
        }
        return dbResult;
        // return h.response(dbResult).code(204);
      })
      .catch(err => {
        if (err.name === 'CastError') {
          return Boom.notFound(err.message);
        } else {
          return Boom.badRequest(err.message);
        }
      });
    return result;
  },
};
