'use strict';

const mModel = require('../../mongoose/auth/user.mongoose');
const automapper = require('automapper-ts');

automapper
  .createMap('dbUser', 'apiUser')
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('email', opts => opts.mapFrom('email'))
  .forMember('password', opts => opts.mapFrom('password'))
  .forMember('role.id', opts => opts.mapFrom('role._id'))
  .forMember('role.name', opts => opts.mapFrom('role.name'))

  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap('dbShortUser', 'apiUser')
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .ignoreAllNonExisting();

automapper
  .createMap('apiUser', 'dbUser')
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('email', opts => opts.mapFrom('email'))
  .forMember('password', opts => opts.mapFrom('password'))
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
        return automapper.map('dbUser', 'apiUser', dbResult);
      } else {
        return automapper.map('dbShortUser', 'apiUser', dbResult);
      }
    });
  },

  // получить пользователя по имени
  async findByName(userName) {
    return mModel
      .findOne({ name: userName })
      .exec()
      .then(dbResult => {
        return automapper.map('dbUser', 'apiUser', dbResult);
      });
  },

  // получить пользователя по id
  async findById(id) {
    return mModel
      .findById(id)
      .exec()
      .then(dbResult => {
        return automapper.map('dbUser', 'apiUser', dbResult);
      });
  },

  // Создать нового пользователя
  async create(apiModel) {
    const dbModel = automapper.map('apiUser', 'dbUser', apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map('dbUser', 'apiUser', dbResult);
    });
  },

  // изменить пользователя
  async update(id, apiModel) {
    const dbModel = automapper.map('apiUser', 'dbUser', apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить пользователя
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
