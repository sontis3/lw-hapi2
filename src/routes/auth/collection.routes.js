'use strict';

const Controller = require('../../controllers/auth/collection.controller');
const Joi = require('joi');
const helpers = require('../../controllers/helpers');
const sysObjects = ['all', 'allAdministration'];

module.exports = [
  {
    path: '/api/admin/collections/{id}',
    method: 'DELETE',
    handler: Controller.dropCollection,
    options: {
      pre: [{ method: helpers.checkAbility('delete', sysObjects) }],
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
    options: {
      pre: [{ method: helpers.checkAbility('create', sysObjects) }],
      validate: {
        params: {
          id: Joi.string().required(),
        },
      },
    },
  },
];
