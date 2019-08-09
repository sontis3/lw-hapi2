'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/catalog/contract.dal');

module.exports = {
  // Получить список контрактов.
  // По умолчанию все контракты.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // создать новый контракт
  async create(request, h) {
    const country = request.payload;
    const result = await Dal.create(country).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  async findOne(request, h) {
    return Boom.notImplemented();
  },

  // изменить страну
  async update(request, h) {
    const id = request.params.id;
    const country = request.payload;
    if (!country) {
      return Boom.badData('No country request data');
    }

    // const appModel = automapper.map('ApiCustomer', 'Customer', customer);

    const result = await Dal.update(id, country)
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

  // Удалить страну
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
