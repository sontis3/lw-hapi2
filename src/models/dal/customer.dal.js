'use strict';

const mModel = require('../mongoose/customer.mongoose');
const automapper = require('automapper-ts');

automapper
  .createMap('dbCustomer', 'apiCustomer')
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

  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap('dbShortCustomer', 'apiCustomer')
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .ignoreAllNonExisting();

automapper
  .createMap('apiCustomer', 'dbCustomer')
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

    query.populate('country', 'name_ru');
    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        return automapper.map('dbCustomer', 'apiCustomer', dbResult);
      } else {
        return automapper.map('dbShortCustomer', 'apiCustomer', dbResult);
      }
    });
  },

  // Создать нового заказчика
  async create(apiModel) {
    const dbModel = automapper.map('apiCustomer', 'dbCustomer', apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map('dbCustomer', 'apiCustomer', dbResult);
    });
  },

  // изменить заказчика
  async update(id, apiModel) {
    const dbModel = automapper.map('apiCustomer', 'dbCustomer', apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить заказчика
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
