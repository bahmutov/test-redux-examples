import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import App from './App'
import {mount} from 'cypress-react-unit-test'

// to correctly initialize the App, just look at what "index.js" is doing

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  // we could hook into this logger from the test
  middleware.push(createLogger());
}

describe('Async App', () => {
  let store

  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(...middleware)
    )

    // let's pass "fetch" requests the application makes through
    // our function that would clone the responses so
    // we can know the data without accessing the Redux store
    cy.stub(window, 'fetch')
      .callsFake((...args) => {
        return window.fetch.wrappedMethod.apply(window, args)
          .then(r => {
            return r.clone().json().then((json) => {
              r.jsonResponse = json
              return r
            })
          })
      })
      .as('fetch')
    mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  it('shows react and frontend news', () => {
    cy.get('li').should('have.length.gt', 10) // news were fetched
    cy.get('@fetch').should('have.been.calledWith', 'https://www.reddit.com/r/reactjs.json')

    cy.get('select').select('frontend')
    // since we are not waiting on UI to show
    // then let's get the FETCH spy - which is auto-retries using the assertion
    cy.get('@fetch').should('have.been.calledWith', 'https://www.reddit.com/r/frontend.json')
    cy.get('li').should('have.length.gt', 10) // DOM has been updated

    // returnValue is a promise, so we need to first resolve it
    // then from the resolved value grab a copy of the JSON response
    // we create in our original stub function
    cy.get('@fetch').its('secondCall.returnValue').its('jsonResponse')
      .then((fetched) => {
        expect(fetched.kind).to.equal('Listing')

        const items = fetched.data.children
        expect(items).to.have.length.gt(10)
        // all fetched items should be shown
        cy.get('li').should('have.length', items.length)
        // first item from the list should be shown in the GUI
        cy.get('li').first().should('have.text', items[0].data.title)
      })
  })
})
