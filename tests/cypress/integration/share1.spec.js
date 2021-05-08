/// <reference types="cypress" />
// test all navigation to ensure backbuttons working
describe("Shareing", () => {
  it("create", () => {
    cy.user("create", 0);
    cy.user("create", 1);
    cy.user("login", 0);
    cy.listAdd("test list 1");
    cy.listMenu("test list 1");
    cy.assertMenu(["info", "members", "edit", "delete"]);
  });
  it("share", () => {
    cy.user("login", 0);
    cy.listMenu("test list 1", "members");
    cy.url().should("include", "/app/members");
    cy.reload();
    cy.get(".native-input").then((node) => node.val("tu1@listle.app"));
    cy.get("#ListMembersPage").should("exist");
    cy.get("#ListMembersPage .ion-padding > .button").click();
    cy.get(".native-input").then((node) => node.val("tu2@listle.app"));
    cy.get("#ListMembersPage .ion-padding > .button").click();
  });
  it("check name resolution", () => {
    cy.user("login", 0);
    cy.listMenu("test list 1", "members");
    cy.url().should("include", "/app/members");
    cy.reload();
    cy.get(":nth-child(3) > .list-md > :nth-child(1)").should(
      "have.text",
      "T1TestUser 1one"
    );
    cy.get(":nth-child(3) > .list-md > :nth-child(2)").should(
      "have.text",
      "@tu2@listle.app"
    );
    cy.logout();
  });
  it("accept 1st user", () => {
    cy.user("login", 1);
    cy.url().should("contain", "/app/list");
    cy.get("#ListsPage .buttons-first-slot > #avatar > div").click();
    cy.get("[data='approve-invites'] ion-label").click();
    cy.get("#ApproveInvites .ion-list > .item").should(
      "have.text",
      "test list 1"
    );
    cy.get("#ApproveInvites .ion-list > .button").click();
    cy.url().should("include", "/app/items");
    cy.home();
    cy.url().should("include", "/app/list");
    cy.listAssert(["test list 1"]);
    cy.listMenu("test list 1");

    cy.assertMenu(["info", "members", "leave"]);
  });
  it("retry accepting first user", () => {
    cy.user("login", 1);
    cy.url().should("contain", "/app/list");
    cy.get("#ListsPage .buttons-first-slot > #avatar > div").click();
    cy.get("[data='approve-invites'] ion-label").click();
    cy.url().should("include", "/approve-invites");
    cy.get("p").should("have.text", "There are no invitations at the moment.");
  });
  it("create and accept 2nd user", () => {
    cy.user("create", 2);
    cy.url().should("include", "/approve-invites");
    cy.get("#ApproveInvites .ion-list > .item").should(
      "have.text",
      "test list 1"
    );
    cy.get("#ApproveInvites .ion-list > .button").click();
    cy.url().should("include", "/app/items");
    cy.home();
    cy.url().should("include", "/app/list");
    cy.listAssert(["test list 1"]);
  });
  it("delete sharing user", () => {
    cy.user("login", 0);
    cy.user("delete", 0);
  });
  it("test list removed", () => {
    cy.user("login", 1);
    cy.get("#ItemsPage ion-item").should("not.exist");
    cy.user("logout");
    cy.user("login", 2);
    cy.get("#ItemsPage ion-item").should("not.exist");
    cy.user("logout");
  });
  it("delete test users", () => {
    cy.user("login", 1);
    cy.user("delete", 1);
    cy.user("login", 2);
    cy.user("delete", 2);
  });
});
