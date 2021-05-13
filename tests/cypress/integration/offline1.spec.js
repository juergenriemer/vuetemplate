/// <reference types="cypress" />
// test all navigation to ensure backbuttons working
describe("Offline", () => {
  it("create", () => {
    cy.task("zog", "This will be output to the terminal");

    const start = "kill $(ps aux | grep '[n]ode app.js' | awk '{print $2}')";
    const stop = ". ./startBackend.sh &";
    cy.exec(stop).its("code").should("eq", 0);
    cy.exec(start).its("code").should("eq", 0);
  });
});
