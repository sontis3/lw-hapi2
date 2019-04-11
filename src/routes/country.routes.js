'use strict';

const CountryController = require('../controllers/country.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/countries',
    method: 'GET',
    handler: CountryController.find,
    options: {
      validate: {
        query: {
          enabled: Joi.boolean(),
          short: Joi.boolean()
        }
        // https://github.com/hapijs/hapi/issues/3706  предоставление детальной информации о валидационной ошибке
        // ,
        // failAction: (request, h, err) => {
        //   throw err;
        // }
      }
    }
  },
  {
    path: '/api/countries',
    method: 'POST',
    handler: CountryController.create,
    options: {
      validate: {
        payload: {
          name_ru: Joi.string().min(2).max(64),
          name_en: Joi.string().min(2).max(64),
          enabled: Joi.boolean()
        }
      }
    }
  },

  {
    path: '/api/countries/{id}',
    method: 'GET',
    handler: CountryController.findOne
  },
  {
    path: '/api/countries/{id}',
    method: 'PUT',
    handler: CountryController.update
  },
  {
    path: '/api/countries/{id}',
    method: 'DELETE',
    handler: CountryController.delete
  }

];