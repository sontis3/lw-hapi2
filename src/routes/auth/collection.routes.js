'use strict';

const Controller = require('../../controllers/auth/collection.controller');
const Joi = require('joi');

module.exports = [
  {
    path: '/api/admin/collections/{id}',
    method: 'DELETE',
    handler: Controller.dropCollection,
    options: {
      validate: {
        params: {
          id: Joi.string().required(),
        },
      },
    },
  },

  {
    path: '/api/admin/collections/{id}',
    method: 'POST',
    handler: Controller.restoreCollection,
  },
];
