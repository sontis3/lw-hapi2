'use strict';

const Boom = require('boom');
const Dal = require('../models/dal/country.dal');

module.exports = {
  // Получить список стран.
  // description: По умолчанию все страны.
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

  // Создать новую страну
  // {
  //   "name_ru": "Украина",
  //   "name_en": "Ukraine",
  //   "enabled": false
  // }
  async create(request, h) {
    const country = request.payload;
    const result = await Dal.create(country)
      .then(res => {
        return res;
      })
      .catch(err => {
        return Boom.badRequest(err.message);
      });
    return result;
  },

  async findOne(request, h) {
    return Boom.notImplemented();
  },

  async update(request, h) {
    const id = request.params.id;
    const country = request.payload;
    if (!country) {
      return Boom.badData('No country request data');
    }

    // const appModel = automapper.map('ApiCustomer', 'Customer', customer);

    let result = await Dal.update(id, country)
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
