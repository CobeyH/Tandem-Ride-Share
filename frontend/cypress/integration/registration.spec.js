describe("User Registration", () => {
  beforeEach(() => {
    cy.logout();
  });
  it("User can access registration from product page", () => {
    cy.visit("/");
    cy.get("[data-cy=register-button]").click();
    cy.contains("Register");
  });

  it("User cannot register without a name", () => {
    cy.visit("/register");
    cy.get("[data-cy=email-input]").type(`jane.doe@example.com`);
    cy.get("[data-cy=password]").type("Ath1389D8*3412daoeu");
    cy.get("[data-cy=create-account-button]").should("be.disabled");
  });

  it("User cannot register without an invalid email", () => {
    cy.visit("/register");
    cy.get("[data-cy=full-name-input]").type("John Doe");
    cy.get("[data-cy=password]").type("Ath1389D8*3412daoeu");
    cy.get("[data-cy=create-account-button]").should("be.disabled");
    cy.get("[data-cy=email-input]").type(`invalidEmail.@com`);
    cy.get("[data-cy=create-account-button]").should("be.disabled");
  });

  it("User cannot register with a weak password", () => {
    cy.visit("/register");
    cy.get("[data-cy=full-name-input]").type("John Doe");
    cy.get("[data-cy=email-input]").type(`jane.doe@example.com`);
    cy.get("[data-cy=password]").type("short");
    cy.get("[data-cy=create-account-button]").should("be.disabled");
  });

  it("User can register with valid information", () => {
    cy.visit("/register");
    cy.get("[data-cy=full-name-input]").type("Jane Doe");
    const emailModifier = Math.round(Math.random() * 100000);
    cy.get("[data-cy=email-input]").type(
      `jane.doe${emailModifier}@example.com`
    );
    cy.get("[data-cy=password]").type("c*1d0a83dsD3[A0P");
    cy.get("[data-cy=create-account-button]").click();
    cy.url().should("include", "/welcome");
  });
});
