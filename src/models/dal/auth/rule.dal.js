'use strict';

const mModel = require('../../mongoose/auth/rule.mongoose');
const automapper = require('automapper-ts');
const morphism = require('morphism').morphism;

const systemObjectSchema = {
  id: '_id',
  name: 'name',
};

const actionSchema = {
  id: '_id',
  name: 'name',
};

const permissionSchema = {
  id: '_id',
  system_object: {
    path: 'system_object',
    fn: (propertyValue, source) => {
      return morphism(systemObjectSchema, propertyValue);
    },
  },
  actions: {
    path: 'actions',
    fn: (propertyValue, source) => {
      return morphism(actionSchema, propertyValue);
    },
  },
};

// схема маппинга морфизма
const schema = {
  id: '_id',
  'role.id': 'role._id',
  'role.name': 'role.name',
  permissions: {
    path: 'permissions',
    fn: (propertyValue, source) => {
      return morphism(permissionSchema, propertyValue);
    },
  },
};

const testData = [
  {
    _id: '5d0a155e3c74d8252884b8a6',
    role: {
      _id: '5d1211c76e5a7a3360afd760',
      name: 'Admin',
    },
    createdAt: '2019-06-25T15:21:27.248+03:00',
    updatedAt: '2019-06-25T15:21:27.248+03:00',
    permissions: [
      {
        _id: '5d0a155e3c74d8252884b8a0',
        system_object: {
          _id: '5d08fea7af076512ec3336a4',
          name: 'country',
          createdAt: '2019-06-25T15:21:27.248+03:00',
          updatedAt: '2019-06-25T15:21:27.248+03:00',
        },
        actions: [
          { _id: '5d0a155e3c74d8252884b8a6', name: 'Read' },
          { _id: '5d1240526e5a7a3360afd767', name: 'Create' },
        ],
      },
      {
        _id: '5d0a155e3c74d8252884b8a1',
        system_object: {
          _id: '5d138109623f9e2da45d79aa',
          name: 'contact',
          createdAt: '2019-06-25T15:21:27.248+03:00',
          updatedAt: '2019-06-25T15:21:27.248+03:00',
        },
        actions: [
          { _id: '5d0a155e3c74d8252884b8a6', name: 'Read' },
          { _id: '5d1240526e5a7a3360afd767', name: 'Create' },
          { _id: '5d1240696e5a7a3360afd768', name: 'Update' },
          { _id: '5d1240736e5a7a3360afd769', name: 'Delete' },
        ],
      },
    ],
  },
];

let dbKey = 'dbRule';
let dbShortKey = 'dbShortRule';
let apiKey = 'apiRule';

// automapper
//   .createMap(dbKey, apiKey)
//   .forMember('id', opts => opts.sourceObject['_id'].subProp)
//   .forMember('role.id', opts => opts.mapFrom('role._id'))
//   .forMember('role.name', opts => opts.mapFrom('role.name'))
//   .forMember('permissions', opts => opts.mapFrom('permissions'))
//   // .forMember('permissions.id', opts => opts.mapFrom('permissions._id'))
//   // .forMember('permissions.system_object.id', opts => opts.mapFrom('permissions.system_object._id'))
//   // .forMember('permissions.system_object.name', opts => opts.mapFrom('permissions.system_object.name'))
//   // .forMember('permissions.actions.id', opts => opts.mapFrom('permissions.actions._id'))
//   // // eslint-disable-next-line prettier/prettier
//   // .forMember('permissions.actions.system_object_action.id', opts => opts.mapFrom('permissions.actions.system_object_action._id'))
//   // // eslint-disable-next-line prettier/prettier
//   // .forMember('permissions.actions.system_object_action.name', opts => opts.mapFrom('permissions.actions.system_object_action.name'))

//   .forMember('__v', opts => opts.ignore())
//   .ignoreAllNonExisting();

automapper
  .createMap(dbShortKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .ignoreAllNonExisting();

automapper
  .createMap(apiKey, dbKey)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('role', opts => opts.mapFrom('roleId'))
  .forMember('system_object', opts => opts.mapFrom('system_objectId'))
  .forMember('system_object_action', opts => opts.mapFrom('system_object_actionId'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список правил доступа.
  // description: По умолчанию все пользователи.
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

    // const retval = automapper.map(dbKey, apiKey, qqq);
    const retval = morphism(schema, testData);
    return retval;

    // return query.exec().then(dbResult => {
    //   if (filter.short !== true) {
    //     return automapper.map(dbKey, apiKey, dbResult);
    //   } else {
    //     return automapper.map(dbShortKey, apiKey, dbResult);
    //   }
    // });
  },

  // получить пользователя по имени
  async findByName(userName) {
    return mModel
      .findOne({ name: userName })
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // получить пользователя по id
  async findById(id) {
    return mModel
      .findById(id)
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // Создать нового пользователя
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить пользователя
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить пользователя
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },
};
