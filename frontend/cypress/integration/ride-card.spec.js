describe("Ride Card Tests", () => {
  describe("Observer tests. Don't change database", () => {
    beforeEach(() => {
      cy.logout();
      cy.login("Tu1cVTl9nB1MKbdERZEFFy8gOCzN");
      cy.visit("/group/ride-card-tests");
    });

    it("Ride cards can be expanded and collapsed", () => {
      cy.get("[data-cy=ride-header]").click();
      cy.get(".leaflet-container").should("be.visible");
      cy.get("[data-cy=ride-header]").click();
      cy.get(".leaflet-container").should("not.be.visible");
    });

    it("Previous rides can be toggled on and off", () => {
      cy.get("[data-cy=ride-card]").should("have.length", 1);
      cy.get("[data-cy=show-complete-rides]").click();
      cy.get("[data-cy=ride-card]").should("have.length", 2);
    });
  });

  describe("Tests that change database", () => {
    beforeEach(() => {
      cy.logout();
      cy.login("jFijsAabXUc0p6iv7yM4F49y62Fk");
      cy.visit("/group/ride-card-tests");
    });

    it("Join and leave ride as passenger", () => {
      cy.get("[data-cy=ride-header]").click();
      // Before joining there should be one person in the ride
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("1");
      cy.get("[data-cy=ride-participation-button]").click();
      // After joining there should be two people in the ride
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("2");
      cy.get("[data-cy=ride-participation-button]").click();
      // After leaving there should be one person in the ride again
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("1");
    });

    it("Join and leave ride as driver", () => {
      cy.get("[data-cy=ride-header]").click();
      // Before joining there should be one person in the ride
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("1");
      cy.get("[data-cy=driver-name]").contains("Driver Needed");
      cy.get("[data-cy=ride-participation-button]").click();
      cy.get("[data-cy=become-driver-button]").click();
      // If the user is the driver they should be able to select a car
      cy.get("[data-cy=choose-car]");
      cy.get("[data-cy=driver-name]").contains("Ride Joiner");
      // After joining there should be two people in the ride and the driver should be filled
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("2");
      cy.get("[data-cy=ride-participation-button]").click();
      // After leaving there should be one person in the ride again and it should need a driver
      cy.get("[data-cy=ride-card]")
        .find("[data-cy=passenger-count]")
        .contains("1");
      cy.get("[data-cy=driver-name]").contains("Driver Needed");
      cy.wait(500); //TODO: This may have exposed a bug in our code. Remove this line and try to get the test to pass.
    });

    it("Adding a pickup point", () => {
      cy.get("[data-cy=ride-header]").click();
      cy.get("[data-cy=ride-participation-button]").click();
      cy.get("[data-cy=add-pickup-button]").click();
      // Type address into pickup point search bar.
      // Reset by leaving the ride at the end
      cy.get("[data-cy=ride-participation-button]").click();
    });
  });
});
