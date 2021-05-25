const config = require("../support/config");

Cypress.Commands.add("listDelete", (title) => {
  cy.visit(config.host + "/app/list");
  cy.listMenu(title, "delete");
  cy.confirm("OK");
  cy.url().should("contain", "/app/list");
});

Cypress.Commands.add("listAssert", (lists) => {
  cy.log("listAssert:" + lists.join(", "));
  cy.visit(config.host + "/app/list");
  cy.get("#ListsPage ion-list ion-item").should("have.length", lists.length);
  cy.get("#ListsPage ion-list")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.text();
      const strFound = lists[ix];
      expect(strFound).equal(strShould);
    });
});

Cypress.Commands.add("listOpen", (title) => {
  cy.log("listOpen:" + [title].join(", "));
  cy.visit(config.host + "/app/list");
  cy.get("#ListsPage ion-list")
    .find("ion-item")
    .each((lbl, ix) => {
      if (title == lbl.text())
        setTimeout(() => {
          lbl.click();
        }, 500);
    });
  cy.url().should("contain", "/app/items");
});

Cypress.Commands.add("listMenu", (title, item) => {
  cy.log("listMenu:" + [title, item].join(", "));
  cy.visit(config.host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.get("ion-item")
    .contains(title)
    .then((node) => {
      const btn = node[0].closest("ion-item").querySelector("ion-button");
      btn.click();
      if (item) {
        cy.get(".popover-viewport")
          .find("ion-item")
          .each((lbl, ix) => {
            const strShould = lbl.attr("data");
            cy.log(strShould, item);
            if (strShould == item) {
              setTimeout(() => {
                lbl.find("ion-label").click();
              }, 100);
            }
          });
      }
    });
});

Cypress.Commands.add("listEdit", (list, title, description) => {
  cy.log("listEdit:" + [list, title, description].join(", "));
  description = description ? description : "";
  cy.visit(config.host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.listMenu(list, "edit");
  cy.url().should("include", "/app/edit");
  cy.get('[name="title"]').then((node) => node.val(title));
  cy.get('[name="description"]').then((node) => node.val(description));
  cy.get(".btn-app-edit").should("not.be.disabled");
  cy.get(".btn-app-edit").click();
  cy.url().should("include", "/app/items");
  //cy.reload();
  cy.get("ion-title").should("have.text", title);
});

Cypress.Commands.add("listAdd", (title, description) => {
  cy.log("listAdd:" + [title, description].join(", "));
  description = description ? description : "n/a";
  cy.visit(config.host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.get("ion-toolbar ion-button").click();
  cy.url().should("contain", "/app/add");
  cy._addList(title, description);
});

Cypress.Commands.add("listAddOffline", (title, description) => {
  cy.log("listAdd:" + [title, description].join(", "));
  description = description ? description : "n/a";
  cy.visit(config.host + "/app/add");
  cy.get("#offline", { timeout: 50000 }).should("be.visible");
  cy.ensureOffline();
  cy._addList(title, description);
});

Cypress.Commands.add("_addList", (title, description) => {
  cy.get('#AddListPage [name="title"]').then((node) => node.val(title));
  cy.get('#AddListPage [name="description"]').then((node) =>
    node.val(description)
  );
  cy.get(".ion-padding > .button:visible").should("not.be.disabled");
  cy.get(".ion-padding > .button:visible").click();
  cy.url().should("include", "/app/items");
  cy.get(
    "#ItemsPage > .header-md > .toolbar-title-default > .title-default"
  ).should("have.text", title);
});
