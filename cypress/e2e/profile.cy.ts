// cypress/e2e/profile.cy.ts
describe('Profile Update Test', () => {
  it('should log in, navigate to account page, and update profile details', () => {
    const userEmail = 'johndoe@example.com';
    const userPassword = '1234';
    const newProfileData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      country: 'Netherlands',
      phoneNumber: '1234567890',
    };

    // Custom login command
    cy.login(userEmail, userPassword);
    cy.url().should('eq', 'http://localhost:3000/');

    // Navigate directly to the account page
    cy.visit('http://localhost:3000/account');

    // Ensure the account information header is visible
    cy.contains('h2', 'Account Information', { timeout: 10000 }).should('be.visible');

    // Update profile details
    cy.updateProfile(newProfileData);

    // Ensure success message is displayed
    cy.contains('Profile updated successfully.', { timeout: 10000 }).should('be.visible');
  });
});
