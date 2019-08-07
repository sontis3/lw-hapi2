'use strict';

const mModel = require('../../mongoose/dir/country.mongoose');
const automapper = require('automapper-ts');

const dbKey = 'dbCountry';
const dbShortKey = 'dbShortCountry';
const apiKey = 'apiCountry';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap(dbShortKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .ignoreAllNonExisting();

automapper
  .createMap(apiKey, dbKey)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .ignoreAllNonExisting();

// исходные данные
const dsTemplate = [
  { _id: '5d4a9984a9fbfea2dc175561', name_ru: 'Венгрия', name_en: 'Hungary', enabled: true },
  { _id: '5d3ae0e0bdaf4893c8be216f', name_ru: 'Германия', name_en: 'Germany', enabled: true },
  { _id: '5cc1d64271c266050488bcce', name_ru: 'Индия', name_en: 'India', enabled: true },
  { _id: '5cc1d77b71c266050488bcd0', name_ru: 'Испания', name_en: 'Spain', enabled: true },
  { _id: '5d445159368238295c40a3f6', name_ru: 'Италия', name_en: 'Italy', enabled: true },
  { _id: '5caf4eb768c4870b983f2d30', name_ru: 'Казахстан', name_en: 'Kazakhstan', enabled: true },
  { _id: '5cc1d7b371c266050488bcd1', name_ru: 'Китай', name_en: 'China', enabled: true },
  { _id: '5d4a9779a9fbfea2dc175560', name_ru: 'Нидерланды', name_en: 'Netherlands', enabled: true },
  { _id: '5caf4dd959c33c3884502fb4', name_ru: 'Россия', name_en: 'Russia', enabled: true },
  { _id: '5d3ad3a90275fab8c0767603', name_ru: 'Швейцария', name_en: 'Switzerland', enabled: true },
];

module.exports = {
  // Получить список стран.
  // description: По умолчанию все страны.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(filter) {
    const dbSelector = {};
    if (typeof filter.enabled !== 'undefined') {
      dbSelector.enabled = filter.enabled;
    }

    let query;
    if (typeof filter.short !== 'undefined' && filter.short === true) {
      query = mModel.find(dbSelector).select({ name_ru: 1 });
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

  // Создать новую страну
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить страну
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true }).exec();
  },

  // удалить страну
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
