/// <reference types="cypress" />
describe("Use Case 1", () => {
  it("create lists", () => {
    cy.user("create", 0);
    cy.url().should("include", "/app/list");
    cy.listAdd("test list 1", "adsf asdf");
    cy.listAdd("test list 2", "adsf asdf");
    cy.listAdd("test list 3", "adsf asdf");
    cy.home();
    cy.url().should("include", "/app/list");
    cy.listAssert(["test list 1", "test list 2", "test list 3"]);
    cy.listDelete("test list 2");
    cy.listAssert(["test list 1", "test list 3"]);
    cy.listAdd("test list 4", "adsf asdf");
    cy.home();
    cy.listAssert(["test list 1", "test list 3", "test list 4"]);
    cy.listDelete("test list 1");
    cy.listDelete("test list 3");
    cy.listDelete("test list 4");
  });
  it("create items", () => {
    cy.user("login", 0);
    cy.listAdd("test list 1", "adsf asdf");
    cy.itemAdd("item 1");
    cy.itemAdd("item 2");
    cy.itemAdd("item 3");
    cy.itemAssert(["item 1", "item 2", "item 3"]);
    cy.itemDelete("item 2");
    cy.itemAssert(["item 1", "item 3"]);
    cy.itemMenu("item 1");
    cy.assertMenu(["edit-mode", "comments", "delete-item"]);
    cy.back();
    cy.listDelete("test list 1");
  });
  it("edit items", () => {
    const delay = 500;
    const back = "{Backspace}{Backspace}{Backspace}{Backspace}";
    cy.user("login", 0);
    cy.listAdd("test list 1", "adsf asdf");
    cy.itemAdd("item");
    cy.itemMenu("item", "edit-mode");
    cy.wait(delay);
    cy.get("#ItemsPage .native-input").type("1234");
    cy.get("#ItemsPage .native-input").type("{Enter}");
    cy.wait(delay);
    cy.itemMenu("item1234", "edit-mode");
    cy.get("#ItemsPage .native-input").should("have.value", "item1234");
    cy.wait(delay);
    cy.get("#ItemsPage .native-input").type(back);
    cy.get("#ItemsPage .native-input").type(back);
    cy.get("#ItemsPage .native-input").type("{Enter}");
    cy.wait(delay);
    cy.get("#ItemsPage .native-input").type("{esc}");
    cy.wait(delay);
    cy.itemMenu("item1234", "edit-mode");
    cy.get("#ItemsPage .native-input").should("have.value", "item1234");
    cy.get("#ItemsPage .native-input").type("{esc}");
    cy.back();
    cy.listDelete("test list 1");
  });
  it("add comments", () => {
    const delay = 500;
    const back = "{Backspace}{Backspace}{Backspace}{Backspace}";
    cy.user("login", 0);
    cy.listAdd("test list 1", "adsf asdf");
    cy.itemAdd("item");
    cy.itemMenu("item", "comments");
    cy.wait(delay);
    cy.get("#CommentsPage [contenteditable]").type("1234");
    cy.get("#comment-buttons > :nth-child(2)").click();
    cy.get(".bubble-content > .text").should("have.text", "1234");
    cy.get("#CommentsPage .btn-base-back").click();
    cy.wait(delay);
    cy.reload();
    cy.get("#ItemsPage ion-item")
      .contains("item")
      .then((node) => {
        node[0]
          .closest("ion-item")
          .querySelector("[aria-label='comments']")
          .click();
      });
    cy.get(".bubble-content > .text").should("have.text", "1234");
    cy.get("[aria-label='delete-comment']").click();
    cy.get('[data="delete-item"]').click();
    cy.confirm("OK");
    cy.get(".bubble").should("not.exist");
    cy.wait(delay);
    cy.get("#CommentsPage .btn-base-back").click();
    cy.get("#ItemsPage .btn-base-back").click();
    cy.listDelete("test list 1");
  });
  it("assert empty", () => {
    cy.user("login", 0);
    cy.get("#ItemsPage ion-item").should("not.exist");
  });
});
