'use strict';

const mModel = require('../../mongoose/auth/user.mongoose');
const automapper = require('automapper-ts');

let dbKey = 'dbUser';
let dbShortKey = 'dbShortUser';
let apiKey = 'apiUser';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('email', opts => opts.mapFrom('email'))
  .forMember('password', opts => opts.mapFrom('password'))
  .forMember('role.id', opts => opts.mapFrom('role._id'))
  .forMember('role.name', opts => opts.mapFrom('role.name'))
  .forMember('createdAt', opts => opts.mapFrom('createdAt'))
  .forMember('updatedAt', opts => opts.mapFrom('updatedAt'))

  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap(dbShortKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .ignoreAllNonExisting();

automapper
  .createMap(apiKey, dbKey)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('email', opts => opts.mapFrom('email'))
  // .forMember('password', opts => opts.mapFrom('password'))
  .forMember('role', opts => opts.mapFrom('roleId'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список пользователей.
  // description: По умолчанию все пользователи.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(filter) {
    let dbSelector = {};
    if (typeof filter.enabled !== 'undefined') {
      dbSelector.enabled = filter.enabled;
    }

    let query;
    if (typeof filter.short !== 'undefined' && filter.short === true) {
      query = mModel.find(dbSelector).select({ name: 1 });
    } else {
      query = mModel.find(dbSelector);
    }

    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        return automapper.map(dbKey, apiKey, dbResult);
      } else {
        return automapper.map(dbShortKey, apiKey, dbResult);
      }
    });
  },

  // получить пользователя по имени
  async findByName(userName) {
    return mModel
      .findOne({ name: userName })
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // получить пользователя по id
  async findById(id) {
    return mModel
      .findById(id)
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // Создать нового пользователя
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить пользователя
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id role
  },

  // удалить пользователя
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
