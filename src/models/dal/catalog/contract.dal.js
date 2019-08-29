'use strict';

const mModel = require('../../mongoose/catalog/contract.mongoose');
const automapper = require('automapper-ts');

const dbKey = 'dbContract';
const dbShortKey = 'dbShortContract';
const apiKey = 'apiContract';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.mapFrom('_id'))
  .forMember('reg_code', opts => opts.mapFrom('reg_code'))
  .forMember('theme', opts => opts.mapFrom('theme'))
  .forMember('reg_date', opts => opts.mapFrom('reg_date'))
  .forMember('deadline_date', opts => opts.mapFrom('deadline_date'))
  .forMember('customer.id', opts => opts.mapFrom('customers._id'))
  .forMember('customer.name', opts => opts.mapFrom('customers.name'))
  .forMember('createdAt', opts => opts.mapFrom('createdAt'))
  .forMember('updatedAt', opts => opts.mapFrom('updatedAt'))
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
  .forMember('theme', opts => opts.mapFrom('theme'))
  .forMember('reg_date', opts => opts.mapFrom('reg_date'))
  .forMember('deadline_date', opts => opts.mapFrom('deadline_date'))
  .forMember('customer', opts => opts.mapFrom('customerId'))
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
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customers',
          },
        },
        { $unwind: '$customers' },
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
