'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/auth/system-object.dal');

module.exports = {
  // Получить список системных объектов.
  // description: По умолчанию все объекты.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Создать новый системный объект
  async create(request, h) {
    const result = await Dal.create(request.payload).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  async findOne(request, h) {
    return Boom.notImplemented();
  },

  // изменить системный объект
  async update(request, h) {
    const id = request.params.id;
    if (!request.payload) {
      return Boom.badData('No request payload data');
    }

    let result = await Dal.update(id, request.payload)
      .then(dbResult => {
        if (dbResult === null) {
          return Boom.notFound(`Документ с id=${id} не найден!`);
        }
        return dbResult;
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

  // Удалить страну
  async delete(request, h) {
    const id = request.params.id;
    let result = await Dal.delete(id)
      .then(dbResult => {
        if (dbResult === null) {
          return Boom.notFound(`Документ с id=${id} не найден!`);
        }
        return dbResult;
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
