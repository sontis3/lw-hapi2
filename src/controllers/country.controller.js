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
      .then(res => { return res; })
      .catch(err => { return Boom.badRequest(err.message); });
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
      .then(res => { return res; })
      .catch(err => { return Boom.badRequest(err.message); });
    return result;
  },
  
  async findOne(request, h) {
    return Boom.notImplemented();
  },
  async update(request, h) {
    return Boom.notImplemented();
  },
  async delete(request, h) {
    return Boom.notImplemented();
  }
}