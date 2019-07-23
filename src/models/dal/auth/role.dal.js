'use strict';

const mModel = require('../../mongoose/auth/role.mongoose');
const automapper = require('automapper-ts');
const morphism = require('morphism').morphism;

let dbKey = 'dbRole';
let dbShortKey = 'dbShortRole';
let apiKey = 'apiRole';

automapper
  .createMap(dbKey, apiKey)
  .forMember('id', opts => opts.sourceObject['_id'].subProp)
  .forMember('name', opts => opts.mapFrom('name'))
  .forMember('tag', opts => opts.mapFrom('tag'))
  .forMember('permissions', opts => opts.mapFrom('permissions'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))

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
  .forMember('tag', opts => opts.mapFrom('tag'))
  .forMember('permissions', opts => opts.mapFrom('permissions'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .ignoreAllNonExisting();

// схема db->api маппинга морфизма
const dbApiActionSchema = {
  id: 'id',
  granted: 'granted',
  'action.id': 'action.id',
  'action.name': 'action.name',
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
  name: 'name',
  enabled: 'enabled',
  permissions: {
    path: 'permissions',
    fn: (propertyValue, source) => {
      return morphism(dbApiPermissionSchema, propertyValue);
    },
  },
};

// схема db->api маппинга морфизма для ответа Model.Create
const dbApiActionCreateSchema = {
  id: 'id',
  granted: 'granted',
  action: {
    path: 'action',
    fn: (propertyValue, source) => {
      return propertyValue.toString();
    },
  },
};

const dbApiPermissionCreateSchema = {
  id: 'id',
  system_object: {
    path: 'system_object',
    fn: (propertyValue, source) => {
      return propertyValue.toString();
    },
  },
  actions: {
    path: 'actions',
    fn: (propertyValue, source) => {
      return morphism(dbApiActionCreateSchema, propertyValue);
    },
  },
};

const dbApiCreateSchema = {
  'role.id': 'id',
  'role.name': 'name',
  'role.enabled': 'enabled',
  permissions: {
    path: 'permissions',
    fn: (propertyValue, source) => {
      return morphism(dbApiPermissionCreateSchema, propertyValue);
    },
  },
};

// исходные данные
const dsTemplate = [
  {
    _id: '5d3720b0cf428ca908d02ba7',
    name: 'Администратор Главный',
    tag: 'adminMain',
    permissions: [
      {
        _id: '5d3720c5cf428ca908d02ba8',
        system_object: '5d371e097583e0aea0ec58dd',
        actions: [
          { _id: '5d3720c5cf428ca908d02bad', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d3720c5cf428ca908d02bac', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d3720c5cf428ca908d02bab', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d3720c5cf428ca908d02baa', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d3720c5cf428ca908d02ba9', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
    ],
    enabled: true,
  },
  {
    _id: '5d305d3fba232a93901b75f2',
    name: 'Администратор',
    tag: 'admin',
    permissions: [
      {
        _id: '5d305d69ba232a93901b7612',
        system_object: '5d2f4a64caf08965a8f17bf1',
        actions: [
          { _id: '5d305d69ba232a93901b7617', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b7616', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b7615', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b7614', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b7613', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
      {
        _id: '5d305d69ba232a93901b760c',
        system_object: '5d2f4958973a9c77b42e3a49',
        actions: [
          { _id: '5d305d69ba232a93901b7611', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b7610', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b760f', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b760e', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b760d', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
      {
        _id: '5d305d69ba232a93901b7606',
        system_object: '5d2f4958973a9c77b42e3a48',
        actions: [
          { _id: '5d305d69ba232a93901b760b', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b760a', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b7609', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b7608', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b7607', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
      {
        _id: '5d305d69ba232a93901b7600',
        system_object: '5d2f4958973a9c77b42e3a4a',
        actions: [
          { _id: '5d305d69ba232a93901b7605', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b7604', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b7603', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b7602', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b7601', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
      {
        _id: '5d305d69ba232a93901b75fa',
        system_object: '5d3052cb118ff05d802da1c7',
        actions: [
          { _id: '5d305d69ba232a93901b75ff', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b75fe', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b75fd', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b75fc', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b75fb', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
      {
        _id: '5d305d69ba232a93901b75f4',
        system_object: '5d3052e8118ff05d802da1c8',
        actions: [
          { _id: '5d305d69ba232a93901b75f9', action: '5d0a155e3c74d8252884b8a6', granted: true },
          { _id: '5d305d69ba232a93901b75f8', action: '5d1240526e5a7a3360afd767', granted: true },
          { _id: '5d305d69ba232a93901b75f7', action: '5d1240736e5a7a3360afd769', granted: true },
          { _id: '5d305d69ba232a93901b75f6', action: '5d1240696e5a7a3360afd768', granted: true },
          { _id: '5d305d69ba232a93901b75f5', action: '5d2dae33d87eba6654d01ee6', granted: true },
        ],
      },
    ],
    enabled: true,
  },

  {
    _id: '5d305d46ba232a93901b75f3',
    name: 'Пользователь',
    tag: 'user',
    permissions: [
      {
        _id: '5d305d8dba232a93901b7622',
        system_object: '5d2f4a64caf08965a8f17bf1',
        actions: [{ _id: '5d305d8dba232a93901b7623', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
      {
        _id: '5d305d8dba232a93901b7620',
        system_object: '5d2f4958973a9c77b42e3a49',
        actions: [{ _id: '5d305d8dba232a93901b7621', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
      {
        _id: '5d305d8dba232a93901b761e',
        system_object: '5d2f4958973a9c77b42e3a48',
        actions: [{ _id: '5d305d8dba232a93901b761f', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
      {
        _id: '5d305d8dba232a93901b761c',
        system_object: '5d2f4958973a9c77b42e3a4a',
        actions: [{ _id: '5d305d8dba232a93901b761d', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
      {
        _id: '5d305d8dba232a93901b761a',
        system_object: '5d3052cb118ff05d802da1c7',
        actions: [{ _id: '5d305d8dba232a93901b761b', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
      {
        _id: '5d305d8dba232a93901b7618',
        system_object: '5d3052e8118ff05d802da1c8',
        actions: [{ _id: '5d305d8dba232a93901b7619', action: '5d0a155e3c74d8252884b8a6', granted: true }],
      },
    ],
    enabled: true,
  },
  {
    _id: '5d319c0af0d44e7fbc2d4225',
    name: 'Новый пользователь',
    tag: 'newUser',
    permissions: [],
    enabled: true,
  },
];

module.exports = {
  // Получить список ролей.
  // description: По умолчанию все роли.
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
      query.populate([
        {
          path: 'permissions.system_object',
          select: 'name',
        },
        {
          path: 'permissions.actions.action',
          select: 'name',
        },
      ]);
    }

    return query.exec().then(dbResult => {
      if (filter.short !== true) {
        return morphism(dbApiSchema, dbResult);
      } else {
        return automapper.map(dbShortKey, apiKey, dbResult);
      }
    });
  },

  // получить роль по id
  async findById(id) {
    return mModel
      .findById(id)
      .populate([
        {
          path: 'permissions.system_object',
          select: 'name tag',
        },
        {
          path: 'permissions.actions.action',
          select: 'name tag',
        },
      ])
      .exec()
      .then(dbResult => {
        return automapper.map(dbKey, apiKey, dbResult);
      });
  },

  // Создать новую роль
  async create(apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);

    return mModel.create(dbModel).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },

  // Изменить роль
  async update(id, apiModel) {
    const dbModel = automapper.map(apiKey, dbKey, apiModel);
    return mModel.findByIdAndUpdate(id, dbModel, { new: true, runValidators: true }).exec();
  },

  // Удалить роль
  async delete(id) {
    return mModel.findByIdAndDelete(id).exec();
  },

  // Создать новые разрешения роли
  async createPermissions(roleId, apiModel) {
    const dbModel = apiModel.system_objectIds.map(item => ({
      system_object: item,
      actions: apiModel.actionIds.map(a => ({ action: a, granted: true })),
    }));

    return mModel
      .findOneAndUpdate(
        { _id: roleId, 'permissions.system_object': { $nin: dbModel.map(item => item.system_object) } },
        { $push: { permissions: dbModel } },
        { new: true, runValidators: true },
      )
      .exec()
      .then(dbResult => {
        if (dbResult === null) {
          throw new Error('Такой системный объект уже имеется в разрешениях данной роли.');
        }
        const retval = morphism(dbApiCreateSchema, dbResult);
        return retval;
      });
  },

  // Изменить действие разрешения роли
  async updatePermAction(roleId, systemObjectId, apiModel) {
    const dbModel = {
      action: apiModel.actionId,
      granted: apiModel.granted,
    };

    return mModel
      .findOne({ _id: roleId, 'permissions.system_object': systemObjectId })
      .exec()
      .then(role => {
        const permission = role.permissions.find(item => item.system_object.toString() === systemObjectId);
        const action = permission.actions.find(item => item.action.toString() === dbModel.action);
        if (action === undefined) {
          permission.actions.push(dbModel);
        } else {
          action.set(dbModel);
        }
        return role.save();
      });
  },

  // Удалить роль
  async deletePermission(roleId, systemObjectId) {
    return mModel.findByIdAndUpdate(roleId, { $pull: { permissions: { system_object: systemObjectId } } }).exec();
  },

  // удалить коллекцию роль
  async dropCollection() {
    return mModel.collection.drop();
  },

  // восстановить коллекцию роль
  async restoreCollection() {
    return mModel.create(dsTemplate).then(dbResult => {
      return automapper.map(dbKey, apiKey, dbResult);
    });
  },
};
