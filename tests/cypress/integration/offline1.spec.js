const config = require("../support/config");
describe("Offline", () => {
  it.only("setup", () => {
    cy.log(config.host);
    cy.log(config.delay);
    cy.startBackend();
    cy.user("create", 0);
    cy.user("login", 0);
    const delay = 500;
    cy.listAdd("list 1", "adsf asdf");
    cy.itemAdd("item 1");
    cy.commentAdd("list 1", "item 1", "comment 1");
    cy.listAdd("list 2", "adsf asdf");
    cy.listAdd("list 3", "adsf asdf");
    cy.reload();
    cy.stopBackend();
    cy.wait(3000);
    cy.get(".alert-button").should("exist");
    cy.get(".alert-button").click();
    cy.reload();
    cy.get(".alert-button").should("exist");
    cy.startBackend();
    cy.wait(5000);
    cy.get(".alert-button").should("not.exist");
  });
  it("tearDown", () => {
    cy.startBackend();
    cy.user("login", 0);
    cy.user("delete", 0);
  });
});
