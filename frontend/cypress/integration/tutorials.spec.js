function completeTutorial(length) {
  for (let i = 0; i < length; i++) {
    cy.get(".react-joyride__tooltip").within(() => {
      cy.contains("Next").click();
    });
  }
  cy.contains("Last").click();
}

// If an element referenced by a tutorial is removed, then the tutorial will skip a step.
// We should ensure that tutorials always have the correct number of steps.
describe("Tutorials complete from start to finish", () => {
  beforeEach(() => {
    cy.logout();
    cy.login();
  });
  it("Get started tutorial", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=tutorial-button]").click();
    completeTutorial(3);
  });
  it("Add car tutorial", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=main-menu]").click();
    cy.get("[data-cy=add-car]").click();
    cy.get("[data-cy=add-car-header]").within(() => {
      cy.get("[data-cy=tutorial-icon]").click();
    });
    completeTutorial(3);
  });
  it("Create group tutorial", () => {
    cy.visit("/group/new");
    cy.get("[data-cy=tutorial-icon]").click();
    completeTutorial(5);
  });
  it("Group page tutorial", () => {
    // TODO: Create a mock group
    // We will need to figure out how to add mock data to the database and clear it after the tests.
  });
  it("Create ride tutorial", () => {
    // TODO: Create a mock group
  });
});
