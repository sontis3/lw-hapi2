'use strict';

const Controller = require('../controllers/country.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/dir/countries',
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
    path: '/api/dir/countries',
    method: 'POST',
    handler: Controller.create,
    options: {
      validate: {
        payload: {
          name_ru: Joi.string()
            .min(2)
            .max(64),
          name_en: Joi.string()
            .min(2)
            .max(64),
          enabled: Joi.boolean(),
        },
      },
    },
  },

  {
    path: '/api/dir/countries/{id}',
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
    path: '/api/dir/countries/{id}',
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
    path: '/api/dir/countries/{id}',
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
