/// <reference types="cypress" />
import React from 'react'
import App from './App'

import {createStore} from 'redux'
import counter from './reducers'

describe('App', () => {
  let store
  beforeEach(() => {
    store = createStore(counter)
  })

  it('works but never prints new counter', () => {
    cy.mount(<App store={store} />)

    cy.wrap(store).invoke('getState').should('equal', 0)
    cy.contains('button', 'Increment async').click().click().click()
    cy.wrap(store).invoke('getState').should('equal', 3)
    cy.contains('Clicked: 0 times').should('be.visible')
  })

  it('works and prints new counter', () => {
    cy.mount(<App store={store} />)
    store.subscribe(() => {
      cy.render(<App store={store} />)
    })

    cy.wrap(store).invoke('getState').should('equal', 0)
    cy.contains('button', 'Increment async').click().click().click()
    cy.wrap(store).invoke('getState').should('equal', 3)
    cy.contains('Clicked: 3 times').should('be.visible')
  })
})
