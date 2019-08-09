'use strict';

const ContractController = require('../../controllers/catalog/contract.controller');

module.exports = [
  {
    path: '/api/catalog/contracts',
    method: 'GET',
    handler: ContractController.find,
  },
  {
    path: '/api/catalog/contracts',
    method: 'POST',
    handler: ContractController.create,
  },

  {
    path: '/api/catalog/contracts/{id}',
    method: 'GET',
    handler: ContractController.findOne,
  },
  {
    path: '/api/catalog/contracts/{id}',
    method: 'PUT',
    handler: ContractController.update,
  },
  {
    path: '/api/catalog/contracts/{id}',
    method: 'DELETE',
    handler: ContractController.delete,
  },

  // {
  //   path: '/api/catalog/contracts/{id}/content',
  //   method: 'GET',
  //   handler: ContractController.getContent,
  // },
  // {
  //   path: '/api/catalog/contracts/{id}/content',
  //   method: 'POST',
  //   handler: ContractController.uploadContent,
  // },

  // {
  //   path: '/api/catalog/contracts/{id}/content/info',
  //   method: 'GET',
  //   handler: ContractController.getContentInfo,
  // },
];
