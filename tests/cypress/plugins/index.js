/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

module.exports = (on, config) => {
  on("task", {
    zog(message) {
      console.log("zog: " + message);
      return null;
    },
    stopBackend() {
      console.log("stopping backend");
      const cmd = "kill $(ps aux | grep 'node app.js' | awk '{print $2}')";
      cy.exec(cmd).then((res) => {
        console.log("stopped backend");
        return null;
      });
    },
  });
};
