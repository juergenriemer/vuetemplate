/// <reference types="cypress" />
// test all navigation to ensure backbuttons working
describe("Shareing", () => {
  it("create", () => {
    cy.user("create", 0);
    cy.user("login", 0);
    cy.listAdd("test list 1");
    cy.back();
    // cy.user("delete", 0);
  });
  it.only("share", () => {
    cy.user("login", 0);
    cy.listMenu("test list 1", "members");
    cy.url().should("include", "/app/members");
    cy.reload();
    cy.get(".native-input").then((node) => node.val("tu2@listle.com"));
    cy.get("#ListMembersPage").should("exist");
    cy.get("#ListMembersPage .ion-padding > .button").click();
    cy.get(".native-input").then((node) => node.val("tu3@listle.com"));
    cy.get("#ListMembersPage .ion-padding > .button").click();
  });
});
