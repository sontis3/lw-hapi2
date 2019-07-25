'use strict';

const Controller = require('../../controllers/dir/country.controller');
const Joi = require('joi');
const helpers = require('../../controllers/helpers');
const sysObjects = ['all', 'allDirectories', 'country'];

module.exports = [
  {
    path: '/api/dir/countries',
    method: 'GET',
    handler: Controller.find,
    options: {
      pre: [{ method: helpers.checkAbility('read', sysObjects) }],
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
      pre: [{ method: helpers.checkAbility('create', sysObjects) }],
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

  // {
  //   path: '/api/dir/countries/{id}',
  //   method: 'GET',
  //   handler: Controller.findOne,
  //   options: {
  //     validate: {
  //       params: {
  //         id: Joi.string()
  //           .regex(/^[0-9a-fA-F]{24}$/)
  //           .required(),
  //       },
  //     },
  //   },
  // },
  {
    path: '/api/dir/countries/{id}',
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
          name_ru: Joi.string()
            .min(3)
            .max(64)
            .required(),
          name_en: Joi.string()
            .min(3)
            .max(64)
            .required(),
          enabled: Joi.boolean().required(),
        },
      },
    },
  },
  {
    path: '/api/dir/countries/{id}',
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
