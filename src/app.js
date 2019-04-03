"use strict";

const Hapi = require("hapi");
// const plugins = require("./plugins");
const routes = require("./routes");

module.exports.createServer = async config => {
  const server = Hapi.server(config);
  // register plugins
  // await plugins.register(server);

  // register routes
  await routes.register(server);

  return server;
};