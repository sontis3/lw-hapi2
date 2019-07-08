'use strict';

const Controller = require('../../controllers/auth/role.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/roles',
    method: 'GET',
    handler: Controller.find,
    options: {
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
      validate: {
        payload: {
          name: Joi.string()
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
  },
  {
    path: '/api/admin/roles/{id}',
    method: 'DELETE',
    handler: Controller.delete,
  },
  {
    path: '/api/admin/roles/{id}/permissions',
    method: 'GET',
    handler: Controller.findPermissions,
    options: {
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
];
