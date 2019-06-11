'use strict';

const Controller = require('../../controllers/auth/system-object.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/system-objects',
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
    path: '/api/admin/system-objects',
    method: 'POST',
    handler: Controller.create,
    options: {
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64),
          enabled: Joi.boolean(),
        },
      },
    },
  },

  {
    path: '/api/admin/system-objects/{id}',
    method: 'GET',
    handler: Controller.findOne,
  },
  {
    path: '/api/admin/system-objects/{id}',
    method: 'PUT',
    handler: Controller.update,
  },
  {
    path: '/api/admin/system-objects/{id}',
    method: 'DELETE',
    handler: Controller.delete,
  },
];
