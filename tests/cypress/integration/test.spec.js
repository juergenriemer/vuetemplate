/// <reference types="cypress" />
// test all navigation to ensure backbuttons working
describe("Test", () => {
  it("test", () => {
    cy.user("create", 1);
    cy.user("login", 1);
    cy.user("delete", 1);
  });
});
