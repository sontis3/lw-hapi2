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
  .forMember('permissions', opts => opts.mapFrom('permissions'))
  .forMember('enabled', opts => opts.mapFrom('enabled'))
  .ignoreAllNonExisting();

// схема db->api маппинга морфизма
const dbApiActionSchema = {
  id: 'id',
  enabled: 'enabled',
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
  enabled: 'enabled',
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
  { _id: '5d305d3fba232a93901b75f2', name: 'Администратор', tag: 'Admin', enabled: true },
  { _id: '5d305d46ba232a93901b75f3', name: 'Пользователь', tag: 'User', enabled: true },
  // { _id: '5d2f4958973a9c77b42e3a49', name: 'Роль', tag: 'role', enabled: true },
  // { _id: '5d2f4958973a9c77b42e3a48', name: 'Пользователь', tag: 'user', enabled: true },
  // { _id: '5d3052cb118ff05d802da1c7', name: 'Заказчик', tag: 'customer', enabled: true },
  // { _id: '5d3052e8118ff05d802da1c8', name: 'Страна', tag: 'country', enabled: true },
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
      actions: apiModel.actionIds.map(a => ({ action: a, enabled: true })),
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
      enabled: apiModel.enabled,
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
