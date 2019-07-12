'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/auth/user.dal');

module.exports = {
  // Получить список пользоватедлей.
  // description: По умолчанию все пользователи.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // изменить пользователя
  async update(request, h) {
    const id = request.params.id;
    const user = request.payload;
    if (!user) {
      return Boom.badData('No user request data');
    }

    // const appModel = automapper.map('ApiCustomer', 'Customer', user);

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
};
