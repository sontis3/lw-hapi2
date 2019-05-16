'use strict';

const Controller = require('../controllers/customer.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/dir/customers',
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
    path: '/api/dir/customers',
    method: 'POST',
    handler: Controller.create,
    // options: {
    //   validate: {
    //     payload: {
    //       name_ru: Joi.string()
    //         .min(2)
    //         .max(64),
    //       name_en: Joi.string()
    //         .min(2)
    //         .max(64),
    //       enabled: Joi.boolean(),
    //     },
    //   },
    // },
  },

  {
    path: '/api/dir/customers/{id}',
    method: 'GET',
    handler: Controller.findOne,
  },
  {
    path: '/api/dir/customers/{id}',
    method: 'PUT',
    handler: Controller.update,
  },
  {
    path: '/api/dir/customers/{id}',
    method: 'DELETE',
    handler: Controller.delete,
  },
];
