'use strict';

const Controller = require('../../controllers/auth/rule.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/rules',
    method: 'GET',
    handler: Controller.find,
    options: {
      validate: {
        query: {
          roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
    path: '/api/admin/rules',
    method: 'POST',
    handler: Controller.create,
    options: {
      validate: {
        payload: {
          roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
          system_objectIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
          actionIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
        },
      },
    },
  },

  {
    path: '/api/admin/rules/{id}',
    method: 'GET',
    handler: Controller.findOne,
  },
  {
    path: '/api/admin/rules/{id}',
    method: 'PUT',
    handler: Controller.update,
  },
  {
    path: '/api/admin/rules/{id}',
    method: 'DELETE',
    handler: Controller.delete,
  },
];
