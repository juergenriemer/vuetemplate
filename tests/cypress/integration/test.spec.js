/// <reference types="cypress" />
// test all navigation to ensure backbuttons working
describe("Test", () => {
  it("test", () => {
    //cy.user("create", 1);
    cy.user("login", 1);
    cy.listAdd("list");
    //cy.listEdit("test list 1", "new title adsf", "new descr");
    cy.listEdit("list", "new");
    cy.wait(30000);
    //cy.user("delete", 1);
  });
});
