describe("Group Creation", () => {
  beforeEach(() => {
    cy.logout();
    cy.login("HoZFgyVFlgv1WhrhJxBgzuBkgH79");
  });

  it("Create group button is accessible", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=new-group]").click();
    cy.contains("Create Group");
  });

  it("Create bare-bones group", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=new-group]").click();
    cy.get("[data-cy=group-name]").type("Cypress Testing Group");
    cy.get("[data-cy=next-step]").click();
    // Don't enter description
    cy.get("[data-cy=next-step]").last().click();
    // Use default plan
    cy.get("[data-cy=next-step]").last().click();
    // Use default publicity
    cy.get("[data-cy=next-step]").last().click();
    // Don't upload media
    cy.get("[data-cy=next-step]").last().click();
    cy.get("[data-cy=group-initials]").should("have.length", 2);
  });

  it("Create group with media", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=new-group]").click();
    cy.get("[data-cy=group-name]").type("Cypress Testing Media");
    cy.get("[data-cy=next-step]").click();
    cy.get("[data-cy=group-description]").type(
      "A testing group for cypress E2E tests"
    );
    cy.get("[data-cy=next-step]").last().click();
    // Use default plan
    cy.get("[data-cy=next-step]").last().click();
    // Make private group
    cy.get("[data-cy=private-group]").click();
    cy.get("[data-cy=next-step]").last().click();
    // Upload banner
    cy.get("input[type=file]")
      .first()
      .selectFile("./cypress/fixtures/group-banner.jpg", { force: true });
    // Upload group photo
    cy.get("input[type=file]")
      .last()
      .selectFile("./cypress/fixtures/group-photo.png", { force: true });
    cy.get(".chakra-alert").contains("Success");
    // Submit group creation
    cy.get("[data-cy=next-step]").last().click();
    cy.get("[data-cy=group-banner]");
    cy.get("[data-cy=group-photo]");
  });

  it("Create group with icon", () => {
    cy.visit("/welcome");
    cy.get("[data-cy=new-group]").click();
    cy.get("[data-cy=group-name]").type("Cypress Testing Group");
    cy.get("[data-cy=next-step]").click();
    // Don't enter description
    cy.get("[data-cy=next-step]").last().click();
    // Use default plan
    cy.get("[data-cy=next-step]").last().click();
    // Use default publicity
    cy.get("[data-cy=next-step]").last().click();
    // Upload icon
    cy.get("[data-cy=icon-browser]").click();
    cy.get("[data-cy=icon-search-filter]").type("Bike");
    cy.get("[data-cy=icon-option]").first().click();
    // Submit Group
    cy.get("[data-cy=next-step]").last().click();
    cy.get("[data-cy=group-icon]").should("have.length", 2);
  });
});
