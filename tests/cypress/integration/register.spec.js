/// <reference types="cypress" />
describe("Registration", () => {
  it("test client side error handling", () => {
    const requiredError = "This field is required";
    const emailError = "This is no valid e-mail";
    const retypedError = "Does not match with your PASSWORD";
    cy.visit("http://10.0.0.165:8100/user/register");
    cy.url().should("include", "/user/register");

    cy.get("button").click();
    cy.get("[for='firstName']").should("have.text", requiredError);
    cy.get("[for='lastName']").should("have.text", requiredError);
    cy.get("[for='email']").should("have.text", requiredError);
    cy.get("[for='password']").should("have.text", requiredError);
    cy.get("[for='retypedPassword']").should("have.text", requiredError);

    cy.get('[name="email"]').clear().type("fakeemailcom");
    cy.get("button").click();
    cy.get("[for='email']").should("have.text", emailError);

    cy.get('[name="email"]').clear().type("fakeemail.com");
    cy.get("button").click();
    cy.get("[for='email']").should("have.text", emailError);

    cy.get('[name="email"]').clear().type("fake@email.com");
    cy.get("button").click();
    cy.get("[for='email']").should("not.exist");

    cy.get('[name="password"]').clear().type("Test123!");
    cy.get('[name="retypedPassword"]').clear().type("Test123!!");
    cy.get("button").click();
    cy.get("[for='retypedPassword']").should("have.text", retypedError);
  });

  it("register user", () => {
    cy.registerUser("fake@email.com", "Test123!", "Test", "User");
  });

  it("register with same email", () => {
    cy.visit("http://10.0.0.165:8100/user/register");
    cy.get('[name="firstName"]').clear().type("Test");
    cy.get('[name="lastName"]').clear().type("User");
    cy.get('[name="email"]').clear().type("fake@email.com");
    cy.get('[name="password"]').clear().type("Test123!");
    cy.get('[name="retypedPassword"]').clear().type("Test123!");
    cy.get("button").click();
    // REF: test for all text content (iincl links)
    cy.get(".message p:nth-child(1)").should(
      "have.text",
      "The account exists already."
    );
  });

  it("delete test user", () => {
    cy.login("fake@email.com", "Test123!");
    cy.deleteUser("fake@email.com", "Test123!");
  });
});
