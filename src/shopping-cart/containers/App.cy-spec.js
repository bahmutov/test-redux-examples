import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import { getAllProducts } from '../actions'
import App from './App'
import {mount} from 'cypress-react-unit-test'

const middleware = [ thunk ];
if (process.env.NODE_ENV !== 'production') {
  // we could hook into this logger from the test
  middleware.push(createLogger());
}

describe('App', () => {
  let store

  beforeEach(() => {
    store = createStore(
      reducer,
      applyMiddleware(...middleware)
    )

    store.dispatch(getAllProducts())

    mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  it('shows the store', () => {
    cy.get('[data-cy="product-item"]').should('have.length', 3)
    // try adding items to the cart
    // then checking out
  })
})
