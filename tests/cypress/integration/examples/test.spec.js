/// <reference types="cypress" />
const delay = 500;
describe("Test", () => {
  it.only("test", () => {
    const list = "asdf";
    const item = "asdf";
    const back = "{Backspace}{Backspace}{Backspace}{Backspace}";
    cy.login("juergen.riemer@gmail.com", "Test123!");
    cy.url().should("include", "/app/list");
    cy.listOpen(list);
    cy.itemMenu(item, "edit-mode");
    cy.wait(delay);
    const input = cy.get("#ItemsPage .native-input");
    input.type("jkl;");
    input.type("{Enter}");
    cy.wait(delay);
    cy.itemMenu(item, "edit-mode");
    cy.wait(delay);
    input.type(back);
    input.type(back);
    input.type("{Enter}");
    cy.wait(delay);
    input.type("{esc}");
    cy.wait(delay);
  });
});
