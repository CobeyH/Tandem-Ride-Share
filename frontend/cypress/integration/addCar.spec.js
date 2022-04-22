describe("Add car modal", () => {
  before(() => {
    cy.login();
    cy.visit("/welcome");
  });
  it("is accessible from menu", () => {
    cy.get("[data-cy=main-menu]").click();
    cy.get("[data-cy=add-car]").click();
  });
  // The user can add a car and the success toast notification is displayed
  it("add car with correct data entry", () => {
    cy.get("[data-cy=car-name]").type("Test-Car");
    cy.get("[data-cy=next-step]").click();
    cy.get("[data-cy=next-step]").last().click();
    cy.get("[data-cy=next-step]").last().click();
    cy.get(".chakra-alert").contains("Car created");
  });
});
