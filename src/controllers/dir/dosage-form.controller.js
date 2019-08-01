'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/dir/dosage-form.dal');

module.exports = {
  // Получить список лекарственных форм.
  async find(request, h) {
    const result = await Dal.find().catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Создать новые правила роли
  async create(request, h) {
    const result = await Dal.create(request.payload).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },
};
