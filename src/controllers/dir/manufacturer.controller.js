'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/dir/manufacturer.dal');

module.exports = {
  // Получить список производителей.
  // По умолчанию все.
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Создать нового производителя
  async create(request, h) {
    const customer = request.payload;
    const result = await Dal.create(customer).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // изменить производителя
  async update(request, h) {
    const id = request.params.id;
    const customer = request.payload;
    if (!customer) {
      return Boom.badData('No manufacturer request data');
    }

    let result = await Dal.update(id, customer)
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

  // удалить производителя
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
