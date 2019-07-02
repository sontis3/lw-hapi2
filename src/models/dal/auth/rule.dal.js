'use strict';

// const mModel = require('../../mongoose/auth/rule.mongoose');
const { RuleModel, PermissionModel } = require('../../mongoose/auth/rule.mongoose');
const automapper = require('automapper-ts');
const morphism = require('morphism').morphism;

// схема db->api маппинга морфизма
const dbApiActionSchema = {
  id: 'id',
  name: 'name',
};

const dbApiPermissionSchema = {
  id: 'id',
  'system_object.id': 'system_object.id',
  'system_object.name': 'system_object.name',
  actions: {
    path: 'actions',
    fn: (propertyValue, source) => {
      return morphism(dbApiActionSchema, propertyValue);
    },
  },
};

const dbApiSchema = {
  id: 'id',
  'role.id': 'role.id',
  'role.name': 'role.name',
  permissions: {
    path: 'permissions',
    fn: (propertyValue, source) => {
      return morphism(dbApiPermissionSchema, propertyValue);
    },
  },
};

// схема api->db маппинга морфизма
const apiDbSchema = {
  role: 'roleId',
  permissions: (iteratee, source, destination) => {
    return iteratee.system_objectIds.map(item => ({ system_object: item, actions: iteratee.actionIds }));
    // return { system_object: iteratee.system_objectIds, actions: iteratee.actionIds };
  },
  // 'permissions.system_object': 'system_objectIds',
  // 'permissions.actions': 'actionIds',
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
  .forMember('role', opts => opts.mapFrom('roleId'))
  .forMember('permissions.system_object', opts => opts.mapFrom('system_objectIds'))
  .forMember('permissions.system_object_action', opts => opts.mapFrom('actionIds'))
  .ignoreAllNonExisting();

module.exports = {
  // Получить список правил доступа.
  // description: По умолчанию правила для всех ролей.
  // Если имеется параметр roleId, то правила только этой роли
  async find(filter) {
    let dbSelector = {};
    if (typeof filter.roleId !== 'undefined') {
      dbSelector.role = filter.roleId;
    }

    // const retval = morphism(dbApiPermissionSchema, testData[0].permissions);
    // return retval;

    let query = RuleModel.find(dbSelector);
    query.populate([
      {
        path: 'role',
        select: 'name',
      },
      {
        path: 'permissions.system_object',
        select: 'name',
      },
      {
        path: 'permissions.actions',
        select: 'name',
      },
    ]);

    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        const retval = morphism(dbApiSchema, dbResult[0]);
        return retval;
        // return automapper.map(dbKey, apiKey, dbResult);
      } else {
        return automapper.map(dbShortKey, apiKey, dbResult);
      }
    });
  },

  // получить пользователя по имени
  async findByName(userName) {
    return RuleModel.findOne({ name: userName })
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // получить пользователя по id
  async findById(id) {
    return RuleModel.findById(id)
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // Создать новые правила роли
  async create(apiModel) {
    const dbModel = morphism(apiDbSchema, apiModel);

    return RuleModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // изменить пользователя
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return RuleModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec(); // runValidators для проверки id country
  },

  // удалить пользователя
  async delete(id) {
    return RuleModel.findByIdAndDelete(id).exec();
  },
};
