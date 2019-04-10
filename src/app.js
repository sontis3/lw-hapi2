"use strict";

const mongoose = require('mongoose');
const mongoDbUri = 'mongodb://localhost:27017/lw_lims';

const Hapi = require("hapi");
// const plugins = require("./plugins");
const routes = require("./routes");

module.exports = {
  connectMongoDb: async () => {
    await mongoose.connect(mongoDbUri, { useNewUrlParser: true }).then(
      () => { console.log(`app is connected to ${mongoDbUri}`); }).catch(
        err => {
          console.error("Could not connect to MongoDB...", err.stack);
          process.exit(1);
        });
  },

  createServer: async config => {
    const server = Hapi.server(config);
    // register plugins
    // await plugins.register(server);

    // register routes
    await routes.register(server);

    return server;
  }
};
