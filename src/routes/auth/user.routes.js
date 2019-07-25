'use strict';

const Controller = require('../../controllers/auth/user.controller');
const Joi = require('joi');
const helpers = require('../../controllers/helpers');
const sysObjects = ['all', 'allAdministration', 'user'];

module.exports = [
  {
    path: '/api/admin/users',
    method: 'GET',
    handler: Controller.find,
    options: {
      pre: [{ method: helpers.checkAbility('read', sysObjects) }],
      validate: {
        query: {
          enabled: Joi.boolean(),
          short: Joi.boolean(),
        },
      },
    },
  },
  {
    path: '/api/admin/users/{id}',
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
            .alphanum()
            .min(3)
            .max(64)
            .required(),
          enabled: Joi.boolean().required(),
          roleId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          email: Joi.string()
            .email()
            .lowercase()
            .required(),
        },
      },
    },
  },
  {
    path: '/api/admin/users/{id}',
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
];
