'use strict';

const Boom = require('boom');
const Dal = require('../../models/dal/auth/role.dal');

module.exports = {
  // Получить список ролей.
  // description: По умолчанию все роли.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(request, h) {
    const filter = request.query;
    const result = await Dal.find(filter).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Создать новую роль
  async create(request, h) {
    const result = await Dal.create(request.payload).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // изменить роль
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

  // Удалить роль
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

  // создать разрешения роли
  async createPermissions(request, h) {
    const roleId = request.params.id;

    const result = await Dal.createPermissions(roleId, request.payload).catch(err => {
      return Boom.badRequest(err.message);
    });
    return result;
  },

  // Изменить действие разрешения роли
  async updatePermAction(request, h) {
    const id = request.params.id;
    const systemObjectId = request.params.sysobjId;

    if (!request.payload) {
      return Boom.badData('No request payload data');
    }

    let result = await Dal.updatePermAction(id, systemObjectId, request.payload)
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

  // Удалить разрешение объекта
  async deletePermission(request, h) {
    const id = request.params.id;
    const systemObjectId = request.params.sysobjId;

    let result = await Dal.deletePermission(id, systemObjectId)
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
