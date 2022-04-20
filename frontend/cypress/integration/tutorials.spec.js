// If a tutorial element that a tutorial references is removed then the tutorial will skip a step.

function completeTutorial(length) {
  for (let i = 0; i < length; i++) {
    cy.get(".react-joyride__tooltip").within(() => {
      cy.contains("Next").click();
    });
  }
  cy.contains("Last").click();
}

describe("Tutorials complete from start to finish", () => {
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
  });
  it("Create ride tutorial", () => {
    // TODO: Create a mock group
  });
});
