'use strict';

const Controller = require('../../controllers/auth/system-object-action.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/system-objects-actions',
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
    path: '/api/admin/system-objects-actions',
    method: 'POST',
    handler: Controller.create,
    options: {
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64),
          tag: Joi.string()
            .min(3)
            .max(64),
          enabled: Joi.boolean(),
        },
      },
    },
  },

  {
    path: '/api/admin/system-objects-actions/{id}',
    method: 'GET',
    handler: Controller.findOne,
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
    path: '/api/admin/system-objects-actions/{id}',
    method: 'PUT',
    handler: Controller.update,
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
    path: '/api/admin/system-objects-actions/{id}',
    method: 'DELETE',
    handler: Controller.delete,
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
];
