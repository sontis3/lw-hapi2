'use strict';

const Controller = require('../../controllers/auth/role.controller');
const Joi = require('joi');
const helpers = require('../../controllers/helpers');
const sysObjects = ['all', 'allAdministration', 'role'];
const sysObjectsPermissions = ['all', 'allAdministration', 'role.permission'];

module.exports = [
  {
    path: '/api/admin/roles',
    method: 'GET',
    handler: Controller.find,
    options: {
      pre: [{ method: helpers.checkAbility('read', sysObjects) }],
      validate: {
        query: {
          enabled: Joi.boolean(),
          short: Joi.boolean(),
        },
        // https://github.com/hapijs/hapi/issues/3706  предоставление детальной информации о валидационной ошибке
        // ,
        // failAction: (request, h, err) => {
        //   throw err;
        // }
      },
    },
  },
  {
    path: '/api/admin/roles',
    method: 'POST',
    handler: Controller.create,
    options: {
      pre: [{ method: helpers.checkAbility('create', sysObjects) }],
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64)
            .required(),
          tag: Joi.string()
            .min(3)
            .max(64)
            .required(),
          enabled: Joi.boolean().required(),
        },
      },
    },
  },
  {
    path: '/api/admin/roles/{id}',
    method: 'PUT',
    handler: Controller.update,
    options: {
      pre: [{ method: helpers.checkAbility('update', sysObjects) }],
      validate: {
        params: {
          id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        },
        payload: {
          name: Joi.string()
            .min(3)
            .max(64)
            .required(),
          tag: Joi.string()
            .min(3)
            .max(64)
            .required(),
          enabled: Joi.boolean().required(),
        },
      },
    },
  },
  {
    path: '/api/admin/roles/{id}',
    method: 'DELETE',
    handler: Controller.delete,
    options: {
      pre: [{ method: helpers.checkAbility('delete', sysObjects) }],
      validate: {
        params: {
          id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        },
      },
    },
  },
  {
    path: '/api/admin/roles/{id}/permissions',
    method: 'POST',
    handler: Controller.createPermissions,
    options: {
      pre: [{ method: helpers.checkAbility('create', sysObjectsPermissions) }],
      validate: {
        params: {
          id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        },
        payload: {
          system_objectIds: Joi.array()
            .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
            .required(),
          actionIds: Joi.array()
            .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
            .required(),
        },
      },
    },
  },
  {
    path: '/api/admin/roles/{id}/permissions/{sysobjId}',
    method: 'PUT',
    handler: Controller.updatePermAction,
    options: {
      pre: [{ method: helpers.checkAbility('update', sysObjectsPermissions) }],
      validate: {
        params: {
          id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          sysobjId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        },
        payload: {
          actionId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          granted: Joi.boolean().required(),
        },
      },
    },
  },
  {
    path: '/api/admin/roles/{id}/permissions/{sysobjId}',
    method: 'DELETE',
    handler: Controller.deletePermission,
    options: {
      pre: [{ method: helpers.checkAbility('delete', sysObjectsPermissions) }],
      validate: {
        params: {
          id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          sysobjId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
        },
      },
    },
  },
];
