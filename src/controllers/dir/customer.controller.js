'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/dir/customer.dal');

module.exports = {
  // Получить список заказчиков.
  // description: По умолчанию все заказчики.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Создать нового заказчика
  async create(request, h) {
    const customer = request.payload;
    const result = await Dal.create(customer).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // найти заказчика
  async findOne(request, h) {
    return Boom.notImplemented();
  },

  // изменить заказчика
  async update(request, h) {
    const id = request.params.id;
    const customer = request.payload;
    if (!customer) {
      return Boom.badData('No customer request data');
    }

    // const appModel = automapper.map('ApiCustomer', 'Customer', customer);

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

  // удалить заказчика
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
