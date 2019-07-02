"use strict";
const { NlpManager } = require("node-nlp");
const modelPath = "model.nlp";

async function manager() {
  const manager = new NlpManager();
  manager.load(modelPath);

  return manager;
}

module.exports = async () => await manager();
