const config = require("../support/config");
Cypress.Commands.add("commentAdd", (list, item, comment) => {
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  cy.itemMenu(item, "comments");
  cy.wait(config.delay);
  cy.get("#CommentsPage [contenteditable]").type(comment);
  cy.get("#comment-buttons > :nth-child(2)").click();
  cy.wait(config.delay);
});
