import "../support/commands"
// login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe("Login", () => {
  it("is accessible via url", () => {
    cy.visit("/login");
    cy.contains("Sign in");
  });
});

describe("Authentication", () => {
  before(() => {
    //TODO: This is hard coded. Needs to be changed
    cy.login("ftVmZ5dG5cZVUQjbxW1w1198jcTk");
  })
  
  it("Visit a page that requires authentication", () => {
    cy.visit("/welcome");
    cy.contains("Welcome to Tandem!")
  })
})