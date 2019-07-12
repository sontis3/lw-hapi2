'use strict';

const Controller = require('../../controllers/auth/user.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/users',
    method: 'GET',
    handler: Controller.find,
    options: {
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
];
