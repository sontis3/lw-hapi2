'use strict';

const mModel = require('../mongoose/country.mongoose');
const automapper = require('automapper-ts');

automapper
  .createMap('dbCountry', 'apiCountry')
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap('dbShortCountry', 'apiCountry')
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .ignoreAllNonExisting();

automapper
  .createMap('apiCountry', 'dbCountry')
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список стран.
  // description: По умолчанию все страны.
  // Если имеется параметр enabled, то true - активные, false - неактивные
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(filter) {
    let dbSelector = {};
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
        return automapper.map('dbCountry', 'apiCountry', dbResult);
      } else {
        return automapper.map('dbShortCountry', 'apiCountry', dbResult);
      }
    });
  },

  // Создать новую страну
  async create(apiModel) {
    const dbModel = automapper.map('apiCountry', 'dbCountry', apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map('dbCountry', 'apiCountry', dbResult);
    });
  },

  // изменить страну
  async update(id, apiModel) {
    const dbModel = automapper.map('apiCountry', 'dbCountry', apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true }).exec();
  },

  // удалить страну
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
