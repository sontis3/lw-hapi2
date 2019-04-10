'use strict';

const Boom = require('boom');
const dal = require('../models/dal/country.dal');

module.exports = {
  async find(request, h) {
    const filter = request.query;
    const result = await dal.find(filter)
      .then(res => { return res; })
      .catch(err => { return Boom.badRequest(err.message); });
    return result;
  },
  async create(request, h) {
    return Boom.notImplemented();
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