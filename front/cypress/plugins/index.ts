/**
 * @type {Cypress.PluginConfig}
 */
const registerCodeCoverageTasks = require('@cypress/code-coverage/task');

module.exports = (on, config) => {
  registerCodeCoverageTasks(on, config);
  return config;
};