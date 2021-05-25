const config = require("../support/config");

Cypress.Commands.add("startBackend", () => {
  const start = ". ./startBackend.sh";
  cy.exec(start, { failOnNonZeroExit: false }); //.its("code").should("eq", 0);
  cy.wait(5000);
});

Cypress.Commands.add("ensureBackendOff", () => {
  const stop =
    "kill -9 $(ps aux | grep '[l]istle-server.js' | awk '{print $2}')";
  cy.exec(stop, { failOnNonZeroExit: false });
});

Cypress.Commands.add("ensureOffline", () => {
  cy.get("#offline", { timeout: 50000 }).should("be.visible");
});

Cypress.Commands.add("stopBackend", () => {
  cy.ensureBackendOff();
  cy.get(".alert-button", { timeout: 50000 }).should("exist");
  cy.get(".alert-button").click();
  cy.get("#offline").should("be.visible");
});

Cypress.Commands.add("home", () => {
  cy.visit(config.host + "/app/list");
  cy.url().should("include", "/app/list");
  //cy.reload();
});

Cypress.Commands.add("confirm", (action) => {
  cy.get("ion-alert button").contains(action).click();
  // ion-alert button OK
});

Cypress.Commands.add("back", () => {
  cy.get(".btn-base-back").click();
});

Cypress.Commands.add("assertMenu", (items) => {
  cy.get(".popover-viewport")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.attr("data");
      const strFound = items[ix];
      expect(strFound).equal(strShould);
    });
  cy.get("ion-backdrop").click();
});

Cypress.Commands.add("personalMenu", () => {
  cy.visit(config.host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.get("#avatar > div").click();
  const menu = cy.get(".popover-viewport");
  return menu;
});
