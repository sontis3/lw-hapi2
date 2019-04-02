'use strict';

module.exports = [
  {
    path: '/api/studies',
    method: 'GET',
    handler: StudyController.find
  },
  {
    path: '/api/studies',
    method: 'POST',
    handler: StudyController.create
  },

  {
    path: '/api/studies/{id}',
    method: 'GET',
    handler: StudyController.findOne
  },
  {
    path: '/api/studies/{id}',
    method: 'PUT',
    handler: StudyController.update
  },
  {
    path: '/api/studies/{id}',
    method: 'DELETE',
    handler: StudyController.delete
  },

  {
    path: '/api/studies/{id}/content',
    method: 'GET',
    handler: StudyController.getContent
  },
  {
    path: '/api/studies/{id}/content',
    method: 'POST',
    handler: StudyController.uploadContent
  },

  {
    path: '/api/studies/{id}/content/info',
    method: 'GET',
    handler: StudyController.getContentInfo
  }

];