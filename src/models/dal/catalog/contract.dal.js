'use strict';

const mModel = require('../../mongoose/catalog/contract.mongoose');
const automapper = require('automapper-ts');

const dbKey = 'dbContract';
const dbShortKey = 'dbShortContract';
const apiKey = 'apiContract';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('country.id', opts => opts.mapFrom('country._id'))
  .forMember('country.name_ru', opts => opts.mapFrom('country.name_ru'))
  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap(dbShortKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .ignoreAllNonExisting();

automapper
  .createMap(apiKey, dbKey)
  .forMember('reg_code', opts => opts.mapFrom('reg_code'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('country', opts => opts.mapFrom('countryId'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список контрактов.
  // По умолчанию все.
  // Фильтр:
  // year - год регистрации
  async find(filter) {
    let query;
    if (typeof filter.year !== 'undefined') {
      query = mModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $year: '$reg_date' }, filter.year],
            },
          },
        },
      ]);
      // query = mModel.find({}).select({ name: 1 });
    } else {
      query = mModel.find({});
    }
    // query.populate('country', 'name_ru');

    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        return automapper.map(dbKey, apiKey, dbResult);
      } else {
        return automapper.map(dbShortKey, apiKey, dbResult);
      }
    });
  },

  // Создать новый контракт
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить производителя
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить производителя
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },

  // // удалить коллекцию системный объект
  // async dropCollection() {
  //   return mModel.collection.drop();
  // },

  // // восстановить коллекцию системный объект
  // async restoreCollection() {
  //   return mModel.create(dsTemplate).then(dbResult => {
  //     return automapper.map(dbKey, apiKey, dbResult);
  //   });
  // },
};
