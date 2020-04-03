/// <reference types="cypress" />
import React from 'react'
import Counter from './Counter'

// compare to tests in Counter.test.js

function setup(value = 0) {
  const actions = {
    onIncrement: cy.stub().as('increment'),
    onDecrement: cy.stub().as('decrement')
  }
  cy.mount(<Counter value={value} {...actions} />)
}

describe('Counter component', () => {
  it('should display count', () => {
    setup()
    cy.contains(/^Clicked: 0 times/)
  })

  it('first button should call onIncrement', () => {
    setup()
    cy.contains('button', '+').click()
    cy.get('@increment').should('have.been.called')
  })

  it('second button should call onDecrement', () => {
    setup()
    cy.contains('button', '-').click()
    cy.get('@decrement').should('have.been.called')
  })

  it('third button should not call onIncrement if the counter is even', () => {
    setup(42)
    cy.contains('button', 'Increment if odd').click()
    cy.get('@increment').should('not.have.been.called')
  })

  it('third button should call onIncrement if the counter is odd', () => {
    setup(43)
    cy.contains('button', 'Increment if odd').click()
    cy.get('@increment').should('have.been.called')
  })

  it('third button should call onIncrement if the counter is odd and negative', () => {
    setup(-43)
    cy.contains('button', 'Increment if odd').click()
    cy.get('@increment').should('have.been.called')
  })

  it('fourth button should call onIncrement in a second', () => {
    setup()
    cy.contains('button', 'Increment async').click()
    cy.get('@increment').should('have.been.called')
  })
})
