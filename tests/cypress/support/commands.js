// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
const host = "http://localhost:8100";
Cypress.Commands.add("home", () => {
  cy.visit(host + "/app/list");
  cy.url().should("include", "/app/list");
});
Cypress.Commands.add("itemAdd", (title) => {
  cy.get("#ItemsPage .native-input").should("have.value", "");
  cy.get("#ItemsPage .native-input").type(title);
  cy.get("#ItemsPage .native-input").type("{Enter}");
});
Cypress.Commands.add("itemAssert", (items) => {
  cy.get("#ItemsPage ion-list")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.text();
      const strFound = items[ix];
      expect(strFound).equal(strShould);
    });
});
Cypress.Commands.add("confirm", (action) => {
  cy.get("ion-alert button").contains(action).click();
  // ion-alert button OK
});
Cypress.Commands.add("back", () => {
  cy.get(".btn-base-back").click();
});
Cypress.Commands.add("itemMenu", (title, item) => {
  cy.url().should("contain", "/app/items");
  cy.reload();
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

Cypress.Commands.add("itemDelete", (title) => {
  cy.itemMenu(title, "delete-item");
  cy.confirm("OK");
  cy.url().should("contain", "/app/items");
});

Cypress.Commands.add("listDelete", (title) => {
  cy.listMenu(title, "delete");
  cy.confirm("OK");
  cy.url().should("contain", "/app/list");
});
Cypress.Commands.add("listAssert", (items) => {
  cy.get("#ListsPage ion-list")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.text();
      const strFound = items[ix];
      expect(strFound).equal(strShould);
    });
});
Cypress.Commands.add("listOpen", (title) => {
  cy.log("open list", title);
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
  cy.visit(host + "/app/list");
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
Cypress.Commands.add("assertMenu", (items) => {
  cy.get(".popover-viewport")
    .find("ion-item")
    .each((lbl, ix) => {
      const strShould = lbl.attr("data");
      const strFound = items[ix];
      expect(strFound).equal(strShould);
    });
  cy.get("ion-backdrop").click();
});

Cypress.Commands.add("personalMenu", () => {
  cy.visit(host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.get("#avatar > div").click();
  const menu = cy.get(".popover-viewport");
  return menu;
});
Cypress.Commands.add("back", () => {
  cy.get(".btn-base-back").click();
});
Cypress.Commands.add("listAdd", (title, description) => {
  description = description ? description : "n/a";
  cy.visit(host + "/app/list");
  cy.url().should("contain", "/app/list");
  cy.get("ion-toolbar ion-button").click();
  cy.url().should("include", "/app/add");
  //cy.get('[name="title"]').clear().type(title);
  //cy.get('[name="description"]').clear().type(description);
  cy.get('[name="title"]').then((node) => node.val(title));
  cy.get('[name="description"]').then((node) => node.val(description));
  cy.get(".btn-app-add").click();
  cy.url().should("include", "/app/items");
  cy.reload();
  cy.get("ion-title").should("have.text", title);
});
Cypress.Commands.add("login", (email, password) => {
  cy.visit(host + "/user/login");
  cy.get('[name="email"]').then((node) => node.val(email));
  cy.get('[name="password"]').then((node) => node.val(password));
  cy.get(".btn-login").click();
  cy.url().should("contain", "/app/list");
});
Cypress.Commands.add("deleteUser", (email, password) => {
  cy.visit(host + "/app/list");
  cy.reload();
  cy.url().should("contain", "/app/list");
  cy.get(".buttons-first-slot > #avatar > div").click();
  cy.get("[data='delete-user'] ion-label").click();
  cy.url().should("contain", "/user/delete");
  cy.reload();
  cy.get('[name="email"]').clear().type(email);
  cy.get('[name="password"]').type(password);

  cy.get("button").click();
  cy.get(".message p:nth-child(1)").should(
    "have.text",
    "Your deletion request was successful."
  );
  cy.readFile("./test-files/Deletion at L.eml").then((str) => {
    let rx = /(http:\/\/[^ ]*)/;
    let url = str.match(rx)[1];
    cy.visit(url);
  });
  cy.url().should("contain", "/user/delete-verify");
  cy.url().should("contain", "/user/login");
});

Cypress.Commands.add("user", (action, name) => {
  const email = `tu${name}@listle.app`;
  const lastName = ["1one", "2two", "3three"];
  switch (action) {
    case "create":
      cy.registerUser(email, "Test123!", "TestUser", lastName[name]);
      break;
    case "login":
      cy.login(email, "Test123!");
      break;
    case "delete":
      cy.deleteUser(email, "Test123!");
      break;
  }
});

Cypress.Commands.add("createTestUser1", () => {
  cy.registerUser("tu1@listle.app", "Test123!", "TestUser", "1one");
});
Cypress.Commands.add("createTestUser2", () => {
  cy.registerUser("tu2@listle.app", "Test123!", "TestUser", "2two");
});
Cypress.Commands.add("createTestUser3", () => {
  cy.registerUser("tu3@listle.app", "Test123!", "TestUser", "3three");
});
Cypress.Commands.add("loginTestUser1", () => {
  cy.login("tu1@listle.app", "Test123!");
});
Cypress.Commands.add("loginTestUser2", () => {
  cy.login("tu2@listle.app", "Test123!");
});
Cypress.Commands.add("loginTestUser3", () => {
  cy.login("tu3@listle.app", "Test123!");
});
Cypress.Commands.add("deleteTestUser1", () => {
  cy.deleteTestUser1("tu1@listle.app", "Test123!");
});
Cypress.Commands.add("deleteTestUser2", () => {
  cy.deleteTestUser1("tu2@listle.app", "Test123!");
});
Cypress.Commands.add("deleteTestUser3", () => {
  cy.deleteTestUser1("tu3@listle.app", "Test123!");
});
Cypress.Commands.add("registerUser", (email, password, firstName, lastName) => {
  cy.visit(host + "/user/register");
  cy.get('[name="firstName"]').then((node) => node.val(firstName));
  cy.get('[name="lastName"]').then((node) => node.val(lastName));
  cy.get('[name="email"]').then((node) => node.val(email));
  cy.get('[name="password"]').then((node) => node.val(password));
  cy.get('[name="retypedPassword"]').then((node) => node.val(password));
  cy.get("button").click();
  cy.get(".message").should(
    "have.text",
    "Your registration was successful.Please check your mailbox for a verification e-mail."
  );
  cy.readFile("./test-files/Registration at L.eml").then((str) => {
    let rx = /(http:\/\/[^ ]*)/;
    let url = str.match(rx)[1];
    cy.visit(url);
  });
  cy.url().should("contain", "/app/list");
});
//
Cypress.Commands.add("resetPassword", (email, password) => {
  cy.visit(host + "/user/reset-password");
  cy.url().should("include", "/user/reset-password");
  cy.get('[name="email"]').clear().type(email);
  cy.get('[name="password"]').clear().type(password);
  cy.get('[name="retypedPassword"]').clear().type(password);
  cy.get("button").click();
  cy.get(".message p:nth-child(1)").should(
    "have.text",
    "Your request to change the password was successful."
  );
  cy.readFile("./test-files/Reset Password at L.eml").then((str) => {
    let rx = /(http:\/\/[^ ]*)/;
    let url = str.match(rx)[1];
    cy.visit(url);
  });
  cy.url().should("contain", "/app/list");
});
Cypress.Commands.add("addList", (name) => {});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
