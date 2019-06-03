'use strict';

const Controller = require('../controllers/auth.controller');
const Joi = require('joi');

module.exports = [
  // {
  //   path: '/api/dir/customers',
  //   method: 'GET',
  //   handler: Controller.find,
  //   options: {
  //     validate: {
  //       query: {
  //         enabled: Joi.boolean(),
  //         short: Joi.boolean(),
  //       },
  //       // https://github.com/hapijs/hapi/issues/3706  предоставление детальной информации о валидационной ошибке
  //       // ,
  //       // failAction: (request, h, err) => {
  //       //   throw err;
  //       // }
  //     },
  //   },
  // },

  // регистрация пользователя
  {
    path: '/api/register',
    method: 'POST',
    handler: Controller.register,
    options: {
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64)
            .required(),
          email: Joi.string()
            .email()
            .lowercase()
            .required(),
          password: Joi.string()
            .min(6)
            .max(16)
            .required(),
        },
      },
    },
  },

  // {
  //   path: '/api/dir/customers/{id}',
  //   method: 'GET',
  //   handler: Controller.findOne,
  // },
  // {
  //   path: '/api/dir/customers/{id}',
  //   method: 'PUT',
  //   handler: Controller.update,
  // },
  // {
  //   path: '/api/dir/customers/{id}',
  //   method: 'DELETE',
  //   handler: Controller.delete,
  // },
];
