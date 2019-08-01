'use strict';

const Controller = require('../../controllers/dir/dosage-form.controller');
const Joi = require('joi');
const helpers = require('../../controllers/helpers');
const sysObjects = ['all', 'allDirectories', 'dosageForm'];

module.exports = [
  {
    path: '/api/dir/dosage-forms',
    method: 'GET',
    handler: Controller.find,
    options: {
      pre: [{ method: helpers.checkAbility('read', sysObjects) }],
    },
  },
  {
    path: '/api/dir/dosage-forms',
    method: 'POST',
    handler: Controller.create,
    options: {
      pre: [{ method: helpers.checkAbility('create', sysObjects) }],
      validate: {
        payload: {
          name: Joi.string()
            .min(3)
            .max(64),
        },
      },
    },
  },
];
