// If a tutorial element that a tutorial references is removed then the tutorial will skip a step.
describe("Tutorials complete from start to finish", () => {
  it("Get started tutorial", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=tutorial-button]").click();
    cy.contains("Next").click();
    cy.contains("Next").click();
    cy.contains("Next").click();
    cy.contains("Last").click();
  });
  it("Add car tutorial", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=main-menu]").click();
    cy.get("[data-cy=add-car]").click();
    cy.get("[data-cy=tutorial-icon]");
    // TODO: Figure out how to select one of the many tutorial buttons.
  });
  it("Create group tutorial", () => {
    cy.visit("/group/new");
    cy.get("[data-cy=tutorial-icon]").click();
    //  TODO: Iterate through all 6 steps.
  });
  it("Group page tutorial", () => {
    // TODO: Create a mock group
  });
  it("Create ride tutorial", () => {
    // TODO: Create a mock group
  });
});
