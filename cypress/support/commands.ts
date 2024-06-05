/// <reference types="cypress" />

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.url().should('include', '/login');

  cy.log('Checking for email input');
  cy.get('input[type="email"]', { timeout: 10000 }).should('be.visible').then(($el) => {
    cy.log('Email input found', $el);
    cy.wrap($el).type(email, { delay: 100 });
  });

  cy.log('Checking for password input');
  cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible').then(($el) => {
    cy.log('Password input found', $el);
    cy.wrap($el).type(password, { delay: 100 });
  });

  cy.log('Checking for submit button');
  cy.get('button[type="submit"]', { timeout: 10000 }).should('be.visible').click();
});

Cypress.Commands.add('updateProfile', (formData) => {
  Object.keys(formData).forEach(key => {
    cy.get(`input[name="${key}"]`, { timeout: 10000 }).clear().type(formData[key], { delay: 100 });
  });
  cy.contains('button', 'Save Changes').click();
});

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password: string): Chainable<void>;
      updateProfile(formData: { [key: string]: string }): Chainable<void>;
    }
  }
}

export {};