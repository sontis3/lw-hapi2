'use strict';

const mModel = require('../../mongoose/auth/system-object-action.mongoose');
const automapper = require('automapper-ts');

let dbKey = 'dbSystemObjectAction';
let dbShortKey = 'dbShortSystemObjectAction';
let apiKey = 'apiSystemObjectAction';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('tag', opts => opts.mapFrom('tag'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))

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
  .forMember('tag', opts => opts.mapFrom('tag'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .ignoreAllNonExisting();

// исходные данные
const dsTemplate = [
  { _id: '5d0a155e3c74d8252884b8a6', name: 'Читать', tag: 'read', enabled: true },
  { _id: '5d1240526e5a7a3360afd767', name: 'Создавать', tag: 'create', enabled: true },
  { _id: '5d1240696e5a7a3360afd768', name: 'Изменять', tag: 'update', enabled: true },
  { _id: '5d1240736e5a7a3360afd769', name: 'Удалять', tag: 'delete', enabled: true },
  { _id: '5d2dae33d87eba6654d01ee6', name: 'Обрабатывать', tag: 'treat', enabled: true },
];

module.exports = {
  // Получить список действий с системными объектами.
  // description: По умолчанию все действия с системными объектами.
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

  // Создать новое действие
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить действие
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec();
  },

  // удалить действие
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },

  // удалить коллекцию действия над системными объектами
  async dropCollection() {
    return mModel.collection.drop();
  },

  // восстановить коллекцию действия над системными объектами
  async restoreCollection() {
    return mModel.create(dsTemplate).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },
};
