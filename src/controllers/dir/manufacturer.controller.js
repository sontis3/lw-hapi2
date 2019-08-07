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
    const newObject = request.payload;
    const result = await Dal.create(newObject).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // изменить производителя
  async update(request, h) {
    const id = request.params.id;
    const updObject = request.payload;
    if (!updObject) {
      return Boom.badData('No manufacturer request data');
    }

    const result = await Dal.update(id, updObject)
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
    const result = await Dal.delete(id)
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
