beforeEach(() => {
  cy.visit("/login");
  cy.logout(); // This command doesn't show up in the tests
});

describe("Login Using UI", () => {
  it("is accessible via url", () => {
    cy.contains("Sign in");
  });
  it("existing user can log in", () => {
    cy.get("[data-cy=email]").type("example@example.com");
    cy.get("[data-cy=password]").type("password");
    cy.get("[data-cy=auth-submit]").click();
    cy.url().should("include", "/welcome");
  });
});

describe("Login without UI", () => {
  before(() => {
    //TODO: This is hard coded. Needs to be changed
    cy.login("ftVmZ5dG5cZVUQjbxW1w1198jcTk");
  });

  it("Visit a page that requires authentication", () => {
    cy.visit("/welcome");
    cy.contains("Welcome to Tandem!");
  });
});
