'use strict';

const mModel = require('../../mongoose/auth/system-object.mongoose');
const automapper = require('automapper-ts');

const dbKey = 'dbSystemObject';
const dbShortKey = 'dbShortSystemObject';
const apiKey = 'apiSystemObject';

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
  { _id: '5d371e097583e0aea0ec58dd', name: 'Все', tag: 'all', enabled: true },
  { _id: '5d371e4a7583e0aea0ec58de', name: 'Все Администрирование', tag: 'allAdministration', enabled: true },
  { _id: '5d371ea57583e0aea0ec58df', name: 'Все Справочники', tag: 'allDirectories', enabled: true },
  { _id: '5d38297925dd557bb0e9c6ce', name: 'Все Реестры', tag: 'allCatalogs', enabled: true },

  { _id: '5d2f4a64caf08965a8f17bf1', name: 'Системный объект', tag: 'systemObject', enabled: true },
  {
    _id: '5d2f4958973a9c77b42e3a4a',
    name: 'Действие над системным объектом',
    tag: 'systemObjectAction',
    enabled: true,
  },
  { _id: '5d2f4958973a9c77b42e3a49', name: 'Роль', tag: 'role', enabled: true },
  { _id: '5d3830bf53b28626dc101600', name: 'Роль.Разрешение', tag: 'role.permission', enabled: true },
  { _id: '5d2f4958973a9c77b42e3a48', name: 'Пользователь', tag: 'user', enabled: true },

  { _id: '5d3052cb118ff05d802da1c7', name: 'Заказчик', tag: 'customer', enabled: true },
  { _id: '5d3052e8118ff05d802da1c8', name: 'Страна', tag: 'country', enabled: true },
  { _id: '5d4196158c20e1a6ccde16cc', name: 'Лекарственная форма', tag: 'dosageForm', enabled: true },
  { _id: '5d42eeb45a2f3e47e0f7abf7', name: 'Производитель', tag: 'manufacturer', enabled: true },

  { _id: '5d4d49c213104f7bfc06ca2c', name: 'Договор', tag: 'contract', enabled: true },
  { _id: '5d4d4a5b13104f7bfc06ca2d', name: 'Исследование', tag: 'study', enabled: true },
];

module.exports = {
  // Получить список системных объектов.
  // description: По умолчанию все системные объекты.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(filter) {
    const dbSelector = {};
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

  // Создать новый системный объект
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить системный объект
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec();
  },

  // удалить системный объект
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },

  // удалить коллекцию системный объект
  async dropCollection() {
    return mModel.collection.drop();
  },

  // восстановить коллекцию системный объект
  async restoreCollection() {
    return mModel.create(dsTemplate).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },
};
