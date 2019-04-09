'use strict';

const app = require('./app');

// конфигурация api
const config = {
  port: 3000,
  host: 'localhost',
};

const init = async () => {
  try {
    // connect to db
    await app.connectMongoDb();

    // create the server
    const server = await app.createServer(config);

    // start the server
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
