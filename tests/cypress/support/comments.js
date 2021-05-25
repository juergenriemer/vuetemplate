const config = require("../support/config");

Cypress.Commands.add("commentOpen", (list, item) => {
  cy.log("commentOpen:" + [list, item].join(", "));
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  cy.itemMenu(list, item, "comments");
  cy.wait(config.delay);
});

Cypress.Commands.add("commentAssert", (list, item, comments) => {
  cy.log("commentAssert:" + [list, item, ...comments].join(", "));
  cy.commentOpen(list, item);
  cy.get("#CommentsPage .comments .text").should(
    "have.length",
    comments.length
  );
  cy.get("#CommentsPage .comments")
    .find(".text")
    .each((lbl, ix) => {
      const strShould = lbl.text();
      const strFound = comments[ix];
      expect(strFound).equal(strShould);
    });
});

Cypress.Commands.add("commentAdd", (list, item, comment) => {
  cy.log("commentAdd:" + [list, item, comment].join(", "));
  cy.commentOpen(list, item);
  cy.get("#CommentsPage [contenteditable]").type(comment);
  cy.get("#comment-buttons > :nth-child(2)").click();
  cy.wait(config.delay);
});
