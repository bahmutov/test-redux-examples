import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import App from './App'

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

    // note that once mounting, App starts fetching news right away
    // so let's spy on "window.fetch" before it
    cy.stub(window, 'fetch')
      .callsFake((...args) => {
        console.log('calling the original fetch')
        return window.fetch.wrappedMethod.apply(window, args)
          .then(r => {
            window.fetch.lastCall.clonedResponse = r.clone()
            r.clonedResponse = r.clone()
            return r
          })
      })
      .as('fetch')
    cy.mount(
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
    // then from the resolved value grab property "clonedResponse"
    cy.get('@fetch').its('secondCall.returnValue').its('clonedResponse')
      .invoke('json')

    // cy.get('@fetch').its('secondCall.returnValue.clonedResponse').invoke('json')
    //   .then(console.log)

    // now let's reach into Redux store, get the fetched news
    // and make sure they are shown correctly in the list
    cy.wrap(store).invoke('getState')
      .then(state => {
        expect(state.selectedSubreddit).to.equal('frontend')
        // all fetched items should be shown
        cy.get('li').should('have.length', state.postsBySubreddit.frontend.items.length)
        // first item from the list should be shown in the GUI
        cy.get('li').first().should('have.text',
          state.postsBySubreddit.frontend.items[0].title)
      })
  })
})
