'use strict';

const authRoutes = require('./auth/auth.routes');
const systemObjectRoutes = require('./auth/system-object.routes');
const systemObjectActionRoutes = require('./auth/system-object-action.routes');
const roleRoutes = require('./auth/role.routes');
const userRoutes = require('./auth/user.routes');
const collectionRoutes = require('./auth/collection.routes');

const countryRoutes = require('./dir/country.routes');
const customerRoutes = require('./dir/customer.routes');
const dosageFormRoutes = require('./dir/dosage-form.routes');
const manufacturerRoutes = require('./dir/manufacturer.routes');

const studyRoutes = require('./study.routes');

module.exports.register = async server => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'My first hapi server!';
    },
  });

  server.route(authRoutes);
  server.route(systemObjectRoutes);
  server.route(systemObjectActionRoutes);
  server.route(roleRoutes);
  server.route(userRoutes);
  server.route(collectionRoutes);

  server.route(countryRoutes);
  server.route(customerRoutes);
  server.route(dosageFormRoutes);
  server.route(manufacturerRoutes);

  server.route(studyRoutes);
};
