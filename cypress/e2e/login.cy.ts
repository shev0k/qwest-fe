// cypress/e2e/login.cy.ts
describe('Login Test', () => {
  it('should successfully log in with valid credentials', () => {
    cy.login('cbadea32@gmail.com', '1234');
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Wait for the page to load and check for specific elements
    cy.contains('h2', 'Stays, Calm Experiences', { timeout: 10000 }).should('be.visible');
    cy.contains('h2', 'Discover New Places', { timeout: 10000 }).should('be.visible');
  });

  it('should show an error message with invalid credentials', () => {
    cy.login('wronguser@example.com', 'wrongpassword');
    
    // Wait for the modal to appear and check for the error message
    cy.get('.modal', { timeout: 10000 }).should('be.visible').within(() => {
      cy.contains('Invalid credentials or user does not exist.').should('be.visible');
    });
  });
});
