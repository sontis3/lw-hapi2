'use strict';

const mModel = require('../../mongoose/dir/dosage-form.mongoose');
const automapper = require('automapper-ts');

let dbKey = 'dbDosageForm';
let apiKey = 'apiDosageForm';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('__v', opts => opts.ignore())
  .ignoreAllNonExisting();

automapper
  .createMap(apiKey, dbKey)
  .forMember('name', opts => opts.mapFrom('name'))
  .ignoreAllNonExisting();

// исходные данные
const dsTemplate = [
  { _id: '5d41a5f06a9f5a11f0dc7265', name: 'Таблетки' },
  { _id: '5d41a62d6a9f5a11f0dc7267', name: 'Капсулы' },
  { _id: '5d41a6306a9f5a11f0dc7268', name: 'Микрокапсулы' },
  { _id: '5d41a63e6a9f5a11f0dc7269', name: 'Нанокапсулы' },
  { _id: '5d41a6416a9f5a11f0dc726a', name: 'Гранулы' },
  { _id: '5d41a6436a9f5a11f0dc726b', name: 'Драже' },
  { _id: '5d41a6456a9f5a11f0dc726c', name: 'Пилюли' },
  { _id: '5d41a6476a9f5a11f0dc726d', name: 'Порошки' },
  { _id: '5d41a6496a9f5a11f0dc726e', name: 'Пастилки' },
  { _id: '5d41a64b6a9f5a11f0dc726f', name: 'Брикеты' },
  { _id: '5d41a64d6a9f5a11f0dc7270', name: 'Карандаш' },
  { _id: '5d41a64f6a9f5a11f0dc7271', name: 'Жевательная резинка' },
  { _id: '5d41a6516a9f5a11f0dc7272', name: 'Пеллеты' },
];

module.exports = {
  // Получить список лекарственных форм.
  async find() {
    return mModel
      .find({})
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // Создать новую лекарственную форму
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
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
