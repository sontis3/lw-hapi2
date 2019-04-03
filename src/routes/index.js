"use strict";

const studyRoutes = require('./studies.routes');

module.exports.register = async server => {
  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "My first hapi server!";
    }
  });

  server.route(studyRoutes);

};