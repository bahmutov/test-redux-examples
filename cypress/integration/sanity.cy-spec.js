/// <reference types="cypress" />
it('runs integration test', () => {
  cy.wrap('foo').should('equal', 'foo')
})
