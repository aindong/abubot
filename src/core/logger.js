"use strict";

/**
 * Logger.
 */

const pino = require("pino");
const _ = require("lodash");

const loggerConfig = {
  level: "debug",
  timestamp: true,
  forceColor: true
};

const logger = pino(loggerConfig);

module.exports = logger;
