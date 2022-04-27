describe("Verify information on product page", () => {
  before(() => {
    cy.logout();
  });

  it("Screenshot of product page desktop", () => {
    cy.visit("/");
    cy.screenshot("Desktop");
  });

  it("Screenshot of product page mobile", () => {
    cy.viewport("iphone-se2");
    cy.visit("/");
    cy.screenshot("Mobile");
    cy.get("[data-cy=mobile-menu-button]").click();
    // TODO: The wait should be replaced with a condition that checks when the menu transition is finished.
    cy.get("[data-cy=mobile-menu-list]").wait(200).screenshot("Mobile-Menu");
  });
});
