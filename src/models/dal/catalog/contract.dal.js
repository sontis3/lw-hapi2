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
  .forMember('name_ru', opts => opts.mapFrom('name_ru'))
  .forMember('name_en', opts => opts.mapFrom('name_en'))
  .forMember('country', opts => opts.mapFrom('countryId'))
  .ignoreAllNonExisting();

// // исходные данные
// const dsTemplate = [
//   { _id: '5d41a5f06a9f5a11f0dc7265', name_ru: 'АО "Пептек"', country: '5caf4dd959c33c3884502fb4' },
//   { _id: '5d41a62d6a9f5a11f0dc7267', name_ru: 'ТОО "Вива фарм"', country: '5caf4eb768c4870b983f2d30' },
//   { _id: '5d41a6306a9f5a11f0dc7268', name_ru: 'Пфайзер Италия С.рЛ', country: '5d445159368238295c40a3f6' },
//   { _id: '5d41a63e6a9f5a11f0dc7269', name_ru: 'Н.В. Органон', country: '5d4a9779a9fbfea2dc175560' },
//   { _id: '5d41a6416a9f5a11f0dc726a', name_ru: 'Фами Кер Лимитед', country: '5cc1d64271c266050488bcce' },
//   { _id: '5d41a6436a9f5a11f0dc726b', name_ru: 'Байер Фарма АГ', country: '5d3ae0e0bdaf4893c8be216f' },
//   { _id: '5d41a6456a9f5a11f0dc726c', name_ru: 'Хетеро  Лабс  Лимитед', country: '5cc1d64271c266050488bcce' },
//   { _id: '5d41a6476a9f5a11f0dc726d', name_ru: 'Новартис Фарма АГ', country: '5d3ad3a90275fab8c0767603' },
//   { _id: '5d41a6496a9f5a11f0dc726e', name_ru: 'Люпин Лтд.', country: '5cc1d64271c266050488bcce' },
//   { _id: '5d41a64b6a9f5a11f0dc726f', name_ru: 'ОАО "Гедеон Рихтер"', country: '5d4a9984a9fbfea2dc175561' },
//   { _id: '5d41a64d6a9f5a11f0dc7270', name_ru: 'Такеда ГмбХ', country: '5d3ae0e0bdaf4893c8be216f' },
//   { _id: '5d41a64f6a9f5a11f0dc7271', name_ru: 'qqqq', country: '5d3ae0e0bdaf4893c8be216f' },
//   { _id: '5d41a6516a9f5a11f0dc7272', name_ru: 'aaaa', country: '5d3ae0e0bdaf4893c8be216f' },
// ];

module.exports = {
  // Получить список производителей.
  // По умолчанию все.
  // Если имеется параметр short, то true - краткий ответ (имя, ид объекта), false - полный ответ (все поля).
  async find(filter) {
    let query;
    if (typeof filter.short !== 'undefined' && filter.short === true) {
      query = mModel.find({}).select({ name: 1 });
    } else {
      query = mModel.find({});
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

  // Создать нового производителя
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
