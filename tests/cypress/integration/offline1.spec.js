const config = require("../support/config");
describe("Offline", () => {
  it("setup", () => {
    cy.stopBackend();
    cy.startBackend();
    cy.user("create", 0);
    cy.user("login", 0);
    cy.listAdd("list 1", "adsf asdf");
    cy.itemAdd("item 1");
    cy.commentAdd("list 1", "item 1", "comment 1");
    cy.commentAdd("list 1", "item 1", "comment 2");
    cy.listAdd("list 2", "adsf asdf");
    cy.listAdd("list 3", "adsf asdf");
    cy.reload();
  });
  it("offline-without-changes", () => {
    cy.user("login", 0);
    cy.reload();
    cy.wait(3000);
    cy.stopBackend();
    cy.wait(3000);
    cy.get(".alert-button").should("exist");
    cy.get(".alert-button").click();
    cy.reload();
    cy.get(".alert-button").should("exist");
    cy.startBackend();
    cy.wait(5000);
    cy.get(".alert-button").should("not.exist");
    cy.listAssert(["list 1", "list 2", "list 3"]);
    cy.listOpen("list 1");
    cy.itemAssert(["item 1"]);
    cy.commentAssert("list 1", "item 1", ["comment 1", "comment 2"]);
  });
  it("offline-with-deletes", () => {
    cy.user("login", 0);
    cy.cylistAssert(["list 1", "list 2", "list 3"]);
    cy.listOpen("list 1");
    cy.itemAssert(["item 1"]);
    cy.commentAssert("list 1", "item 1", ["comment 1", "comment 2"]);
    cy.reload();
    cy.wait(3000);
    cy.stopBackend();
    cy.wait(3000);
    cy.get(".alert-button").should("exist");
    cy.get(".alert-button").click();
    cy.reload();
    cy.get(".alert-button").should("exist");
    cy.startBackend();
    cy.wait(5000);
    cy.get(".alert-button").should("not.exist");
    cy.listAssert(["list 1", "list 2", "list 3"]);
    cy.listOpen("list 1");
    cy.itemAssert(["item 1"]);
    cy.commentAssert("list 1", "item 1", ["comment 1", "comment 2"]);
  });
  it("offline-with-changes", () => {});
  it("offline-with-deletes-and-changes", () => {});
  it("offline-with-changes-with-app-load-inbetween", () => {});
  it("tearDown", () => {
    cy.startBackend();
    cy.user("login", 0);
    cy.user("delete", 0);
  });
});
