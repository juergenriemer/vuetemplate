/// <reference types="cypress" />
describe("Reset password", () => {
  it("test client side error handling", () => {
    const requiredError = "This field is required";
    const emailError = "This is no valid e-mail";
    const retypedError = "Does not match with your PASSWORD";
    cy.visit("http://10.0.0.165:8100/user/reset-password");
    cy.url().should("include", "/user/reset-password");

    cy.get("button").click();
    cy.get("[for='email']").should("have.text", requiredError);
    cy.get("[for='password']").should("have.text", requiredError);
    cy.get("[for='retypedPassword']").should("have.text", requiredError);

    cy.get('[name="email"]').clear().type("fakeemailcom");
    cy.get("button").click();
    cy.get("[for='email']").should("have.text", emailError);

    cy.get('[name="password"]').clear().type("Test123!");
    cy.get('[name="retypedPassword"]').clear().type("Test123!!");
    cy.get("button").click();
    cy.get("[for='retypedPassword']").should("have.text", retypedError);
  });

  it.only("reset password", () => {
    cy.registerUser("fake@email.com", "Test!234", "Test", "User");
    cy.login("fake@email.com", "Test!234");
    cy.resetPassword("fake@email.com", "Test!123!");
    cy.login("fake@email.com", "Test!123!");
    cy.deleteUser("fake@email.com", "Test!123!");
  });
});
