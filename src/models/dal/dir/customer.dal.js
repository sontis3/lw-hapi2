'use strict';

const mModel = require('../../mongoose/dir/customer.mongoose');
const automapper = require('automapper-ts');

const dbKey = 'dbCustomer';
const dbShortKey = 'dbShortCustomer';
const apiKey = 'apiCustomer';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .forMember('country.id', opts => opts.mapFrom('country._id'))
  .forMember('country.name_ru', opts => opts.mapFrom('country.name_ru'))
  .forMember('zip_code', opts => opts.mapFrom('zip_code'))

  .forMember('city', opts => opts.mapFrom('city'))
  .forMember('region', opts => opts.mapFrom('region'))
  .forMember('address_line_1', opts => opts.mapFrom('address_line_1'))
  .forMember('address_line_2', opts => opts.mapFrom('address_line_2'))
  .forMember('address_line_3', opts => opts.mapFrom('address_line_3'))
  .forMember('email', opts => opts.mapFrom('email'))
  .forMember('phone_1', opts => opts.mapFrom('phone_1'))
  .forMember('phone_2', opts => opts.mapFrom('phone_2'))
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
  .forMember('country', opts => opts.mapFrom('countryId'))
  .forMember('zip_code', opts => opts.mapFrom('zip_code'))
  .forMember('city', opts => opts.mapFrom('city'))
  .forMember('region', opts => opts.mapFrom('region'))
  .forMember('address_line_1', opts => opts.mapFrom('address_line_1'))
  .forMember('address_line_2', opts => opts.mapFrom('address_line_2'))
  .forMember('address_line_3', opts => opts.mapFrom('address_line_3'))
  .forMember('email', opts => opts.mapFrom('email'))
  .forMember('phone_1', opts => opts.mapFrom('phone_1'))
  .forMember('phone_2', opts => opts.mapFrom('phone_2'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список заказчиков.
  // description: По умолчанию все заказчики.
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

    query.populate('country', 'name_ru');
    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        return automapper.map(dbKey, apiKey, dbResult);
      } else {
        return automapper.map(dbShortKey, apiKey, dbResult);
      }
    });
  },

  // Создать нового заказчика
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить заказчика
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить заказчика
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
