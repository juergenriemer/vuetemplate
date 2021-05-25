const config = require("../support/config");

Cypress.Commands.add("itemAdd", (list, item, offline) => {
  cy.log("itemAdd:" + [list, item].join(", "));
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  cy.get("#ItemsPage .native-input").should("have.value", "");
  cy.get("#ItemsPage .native-input").type(item);
  cy.get("#ItemsPage .native-input").type("{Enter}");
});

Cypress.Commands.add("itemAddOffline", (list, item, mode) => {
  cy.log("itemAddOffline:" + [list, item].join(", "));
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  cy.ensureOffline();
  cy.get("#ItemsPage .native-input").should("have.value", "");
  cy.get("#ItemsPage .native-input").type(item);
  cy.get("#ItemsPage .native-input").type("{Enter}");
});

Cypress.Commands.add("itemAssert", (list, items) => {
  cy.log("itemAssert:" + [list, ...items].join(", "));
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  //cy.reload();
  cy.get("#ItemsPage ion-list ion-item").should("have.length", items.length);
  cy.get("#ItemsPage ion-list")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.text();
      const strFound = items[ix];
      expect(strFound).equal(strShould);
    });
});

Cypress.Commands.add("itemMenu", (list, title, item) => {
  cy.log("itemMenu:" + [list, title, item].join(", "));
  cy.visit(config.host + "/app/list");
  cy.listOpen(list);
  //cy.reload();
  cy.get("ion-backdrop").should("not.exist");
  cy.get("#ItemsPage ion-item")
    .contains(title)
    .then((node) => {
      node[0]
        .closest("ion-item")
        .querySelector("[aria-label='item-menu']")
        .click();
      if (item) {
        cy.get(".popover-viewport")
          .find("ion-item")
          .each((lbl, ix) => {
            const strShould = lbl.attr("data");
            if (strShould == item) {
              setTimeout(() => {
                lbl.find("ion-label").click();
              }, 100);
            }
          });
      }
    });
  //cy.get("ion-backdrop").should("not.exist");
});

Cypress.Commands.add("itemEdit", (list, item, title) => {
  cy.log("itemEdit:" + [list, item, title].join(", "));
  cy.itemMenu(list, item, "edit-mode");
  cy.wait(config.delay);
  cy.get("#ItemsPage .native-input").type(title); //then((node) => node.val(title));
  cy.get("#ItemsPage .native-input").type("{Enter}");
  cy.wait(config.delay);
});

Cypress.Commands.add("itemDelete", (list, item) => {
  cy.log("itemDelete:" + [list, item].join(", "));
  cy.visit(config.host + "/app/list");
  //cy.reload();
  cy.itemMenu(list, item, "delete-item");
  cy.get(".alert-button-group > :nth-child(2)").should("exist");
  cy.get(".alert-button-group > :nth-child(2)").click();
  cy.url().should("contain", "/app/items");
});
