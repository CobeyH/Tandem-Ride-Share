describe("User Registration", () => {
  beforeEach(() => {
    cy.logout();
  });
  it("User can access registration from product page", () => {
    cy.visit("/");
    cy.get("[data-cy=register-button]").click();
    cy.contains("Register");
  });
  it("User can register", () => {
    cy.visit("/register");
    cy.get("[data-cy=full-name-input]").type("Jane Doe");
    const emailModifier = Math.round(Math.random() * 1000);
    cy.get("[data-cy=email-input]").type(
      `jane.doe${emailModifier}@example.com`
    );
    cy.get("[data-cy=password]").type("password");
    cy.get("[data-cy=create-account-button]").click();
    cy.url().should("include", "/welcome");
  });
});
