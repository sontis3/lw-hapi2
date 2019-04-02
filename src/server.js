'use strict';

const Hapi = require('hapi');
const studyRoutes = require('./routes/studies.routes');

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return 'Hello, world!';
  }
});

server.route(studyRoutes);

const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
