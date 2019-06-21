'use strict';

const mModel = require('../../mongoose/auth/permission.mongoose');
const automapper = require('automapper-ts');

let dbKey = 'dbPermission';
let dbShortKey = 'dbShortPermission';
let apiKey = 'apiPermission';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('role.id', opts => opts.mapFrom('role._id'))
  .forMember('role.name', opts => opts.mapFrom('role.name'))
  .forMember('system_object.id', opts => opts.mapFrom('system_object._id'))
  .forMember('system_object.name', opts => opts.mapFrom('system_object.name'))
  .forMember('system_object_action.id', opts => opts.mapFrom('system_object_action._id'))
  .forMember('system_object_action.name', opts => opts.mapFrom('system_object_action.name'))

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
  .forMember('role', opts => opts.mapFrom('roleId'))
  .forMember('system_object', opts => opts.mapFrom('system_objectId'))
  .forMember('system_object_action', opts => opts.mapFrom('system_object_actionId'))
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
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить пользователя
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
