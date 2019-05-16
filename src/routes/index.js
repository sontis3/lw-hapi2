'use strict';

const countryRoutes = require('./country.routes');
const customerRoutes = require('./customer.routes');
const studyRoutes = require('./study.routes');

module.exports.register = async server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'My first hapi server!';
    },
  });

  server.route(countryRoutes);
  server.route(customerRoutes);
  server.route(studyRoutes);
};
