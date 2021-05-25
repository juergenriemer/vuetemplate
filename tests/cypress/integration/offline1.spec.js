const config = require("../support/config");
describe("Offline", () => {
  it.skip("test", () => {
    cy.user("login", 0);
    cy.visit(config.host + "/user/synchronize");
    cy.window().then((win) => {
      cy.log("1111111");
      cy.log(JSON.stringify(win.x));
      // call whatever you want on your app's window
      // so your app methods must be exposed somehow
    });
  });
  it("setup", () => {
    cy.clearLocalStorage("offline-since");
    cy.ensureBackendOff();
    cy.startBackend();
    cy.user("create", 0);
    cy.user("login", 0);
    cy.listAdd("list A");
    cy.listAdd("list B");
    cy.itemAdd("list A", "item a");
    cy.itemAdd("list A", "item b");
    cy.commentAdd("list A", "item b", "comment 1");
  });
  it("offline_changes", () => {
    cy.user("login", 0);
    cy.reload();
    cy.stopBackend();
    cy.listAddOffline("list 1");
    cy.listAddOffline("list 2");
    cy.itemAddOffline("list A", "item 0");
    cy.itemAddOffline("list 1", "item 0");
    cy.itemAddOffline("list 1", "item 1");
    //cy.itemEdit("list A", "item a", "awiegl");
    cy.startBackend();
    cy.wait(4000);
    cy.syncNow();
    cy.url().should("contain", "/user/synchronize");
    cy.window().then((win) => {
      cy.log("1111111");
      cy.log(JSON.stringify(win.x));
      // call whatever you want on your app's window
      // so your app methods must be exposed somehow
    });
    cy.get("#Synchronize .action", { timeout: 6000 }).contains("add list");
    cy.wait(10000);
    cy.url().should("contain", "/app/list");
    cy.listAssert(["list A", "list B", "list 1", "list 2"]);
  });
  it.skip("offline-with-changesxxxx", () => {});
  it.skip("offline-with-deletes-and-changes", () => {});
  it.skip("offline-with-changes-with-app-load-inbetween", () => {});
  it("tearDown", () => {
    cy.user("login", 0);
    cy.user("delete", 0);
  });
});
