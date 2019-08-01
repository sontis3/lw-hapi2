'use strict';

const Boom = require('boom');
const dalSystemObject = require('../../models/dal/auth/system-object.dal');
const dalSystemObjectAction = require('../../models/dal/auth/system-object-action.dal');
const dalRole = require('../../models/dal/auth/role.dal');
const dalDosageForm = require('../../models/dal/dir/dosage-form.dal');

module.exports = {
  // Удалить коллекцию
  async dropCollection(request, h) {
    const id = request.params.id;
    let Dal;
    switch (id) {
      case 'systemObject':
        Dal = dalSystemObject;
        break;
      case 'systemObjectAction':
        Dal = dalSystemObjectAction;
        break;
      case 'role':
        Dal = dalRole;
        break;
      case 'dosageForm':
        Dal = dalDosageForm;
        break;

      default:
        return Boom.notFound(`Коллекция ${id} не найдена!`);
    }
    let result = await Dal.dropCollection()
      .then(dbResult => {
        if (dbResult === null) {
          return Boom.notFound(`Коллекция ${id} не найдена!`);
        }
        return dbResult;
      })
      .catch(err => {
        if (err.name === 'CastError' || err.codeName === 'NamespaceNotFound') {
          return Boom.notFound(err.message);
        } else {
          return Boom.badRequest(err.message);
        }
      });
    return result;
  },

  // Восстановить коллекцию по умолчанию
  async restoreCollection(request, h) {
    const id = request.params.id;
    let Dal;
    switch (id) {
      case 'systemObject':
        Dal = dalSystemObject;
        break;
      case 'systemObjectAction':
        Dal = dalSystemObjectAction;
        break;
      case 'role':
        Dal = dalRole;
        break;
      case 'dosageForm':
        Dal = dalDosageForm;
        break;

      default:
        return Boom.notFound(`Коллекция ${id} не найдена!`);
    }
    let result = await Dal.restoreCollection()
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
