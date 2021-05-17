const config = require("../support/config");

Cypress.Commands.add("login", (email, password) => {
  cy.visit(config.host + "/user/login");
  cy.get('[name="email"]').then((node) => node.val(email));
  cy.get('[name="password"]').then((node) => node.val(password));
  cy.get(".btn-login").click();
  cy.url().should("contain", "/app/list");
});

Cypress.Commands.add("logout", (email, password) => {
  cy.visit(config.host + "/app/list");
  cy.reload();
  cy.url().should("contain", "/app/list");
  cy.get(".buttons-first-slot > #avatar > div").click();
  cy.get("[data='logout'] ion-label").click();
  cy.url().should("contain", "/user/login");
});

Cypress.Commands.add("deleteUser", (email, password) => {
  cy.visit(config.host + "/app/list");
  cy.reload();
  cy.url().should("contain", "/app/list");
  cy.get(".buttons-first-slot > #avatar > div").click();
  cy.get("[data='delete-user'] ion-label").click();
  cy.url().should("contain", "/user/delete");
  cy.reload();
  cy.get('[name="email"]').then((node) => node.val(email));
  cy.get('[name="password"]').then((node) => node.val(password));
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

Cypress.Commands.add("registerUser", (email, password, firstName, lastName) => {
  cy.visit(config.host + "/user/register");
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
});

Cypress.Commands.add("resetPassword", (email, password) => {
  cy.visit(config.host + "/user/reset-password");
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

Cypress.Commands.add("user", (action, name) => {
  const email = `tu${name}@listle.app`;
  const lastName = ["0zero", "1one", "2two", "3three"];
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
