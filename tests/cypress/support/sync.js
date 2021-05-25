const config = require("../support/config");

Cypress.Commands.add("syncNow", () => {
  cy.log("syncNow");
  cy.get(":nth-child(3) > .alert-button-inner").should("exist");
  cy.get(":nth-child(3) > .alert-button-inner").click();
});
