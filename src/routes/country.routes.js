'use strict';

const CountryController = require('../controllers/country.controller');

module.exports = [
  {
    path: '/api/countries',
    method: 'GET',
    handler: CountryController.find
  },
  {
    path: '/api/countries',
    method: 'POST',
    handler: CountryController.create
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