/// <reference types="cypress" />
import React from 'react'
import App from './App'

import {createStore} from 'redux'
import counter from './reducers'
import {mount} from 'cypress-react-unit-test'

describe('App', () => {
  let store
  beforeEach(() => {
    store = createStore(counter)
  })

  it('works but never prints new counter', () => {
    mount(<App store={store} />)

    cy.wrap(store).invoke('getState').should('equal', 0)
    cy.contains('button', 'Increment async').click().click().click()
    cy.wrap(store).invoke('getState').should('equal', 3)
    cy.contains('Clicked: 0 times').should('be.visible')
  })

  // need to bring "cy.render" somehow to mount branch from "master"
  it.skip('works and prints new counter', () => {
    mount(<App store={store} />)
    store.subscribe(() => {
      cy.render(<App store={store} />)
    })

    cy.wrap(store).invoke('getState').should('equal', 0)
    cy.contains('button', 'Increment async').click().click().click()
    cy.wrap(store).invoke('getState').should('equal', 3)
    cy.contains('Clicked: 3 times').should('be.visible')
  })
})
