'use strict';

const Controller = require('../controllers/auth.controller');
const Joi = require('joi');

module.exports = [
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
      auth: false,
    },
  },

  // логин пользователя
  {
    path: '/api/login',
    method: 'POST',
    handler: Controller.login,
    options: {
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64)
            .required(),
          password: Joi.string()
            .min(6)
            .max(16)
            .required(),
        },
      },
      auth: false,
    },
  },
];
