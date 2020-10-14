/// <reference types="cypress" />
import React from 'react'
import App from './App'
import {mount} from 'cypress-react-unit-test'

import {createStore} from 'redux'
import counter from './reducers'

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

  it('works and prints new counter', () => {
    mount(<App store={store} />).then(component => {
      store.subscribe(() => {
        // mount(<App store={store} />)
        // component.props.store = store
        console.log('new store', store)
      })
    })

    cy.wrap(store).invoke('getState').should('equal', 0)
    cy.contains('button', 'Increment async').click().click().click()
    cy.wrap(store).invoke('getState').should('equal', 3)

    // TODO rerender the component with new store
    // cy.contains('Clicked: 3 times').should('be.visible')
  })
})
